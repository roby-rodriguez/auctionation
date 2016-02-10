/**
 * Websockets controller
 */
var Constants = require('../config/local.env');
var User = require('../model/user');
var auctions = [], current;
// this is ugly, I know
var initialized;
module.exports = function (io) {

    // start main timer
    if (!initialized) {
        setInterval(runTimer, 1000);
        initialized = true;
    }

    function prettyPrint(auction) {
        if (auction) {
            return 'U_' + auction.userName + ' Q_' + auction.quantity + ' MV_' + auction.minValue
                + ' WV_' + auction.winningBid + ' WU_' + auction.winningBidder;
        } else
            return 'none';
    }

    /**
     * this acts like a "master"-timer, it might be a bit inefficient
     * but I can't figure out anything else right now, so it will have to do
     */
    function runTimer() {
        if (current) {
            console.log('Run-timer timeout:'
                + ' remaining ' + current.timeRemaining
                + ' current ' + prettyPrint(current)
                + ' queue length ' + auctions.length
            );
            // if timer expired for current auction
            if (current.timeRemaining == 0) {
                // notify owner and other participants bid is over
                io.emit('auction:closed', current);
                // update user stats in case a valid trade took place
                if (current.winningBid && current.winningBidder) {
                    User.updateUserStats(current).then(function () {
                        // ideally only participants should be updated, for the purpose of this project -> update all
                        io.emit('user:update');
                    });
                } else {
                    // only auctioner should be updated
                    io.emit('user:update');
                }
                // reset values
                current = null;
            } else {
                io.emit('time:update', current.timeRemaining--);
            }
        } else {
            if (auctions.length) {
                current = auctions.shift();
                // listeners will now start their local clocks
                io.emit('auction:new', current);
                console.log('Processing auction: ' + prettyPrint(current));
            }
        }
    }

    return function(socket) {
        // enqueue new auctions
        socket.on('auction:new', function (data) {
            var newAuction = {
                userName: data.userName,
                type: data.type,
                quantity: parseInt(data.quantity),
                minValue: parseInt(data.minValue),
                //winningBid: data.minValue,
                timeRemaining: Constants.TIMEOUT
            };
            auctions.push(newAuction);
            console.log('Added new auction: ' + prettyPrint(newAuction));
        });

        // announce new logged in users of ongoing auctions
        socket.on('auction:check', function (userName) {
            // should we keep a flag for login and only broadcast if active?
            // or better yet is there any other solution here?
            socket.broadcast.emit('user:logout', userName);
            console.log('Logged out: ' + userName);

            if (current) {
                socket.emit('auction:new', current);
            }
            console.log('Auction check: ' + prettyPrint(current) + ' user: ' + userName);
        });

        // broadcast new bids
        socket.on('auction:bid', function (data) {
            // if there's an auction going on and this is the highest bid so far
            var validateMin, validateWin;
            data.bid = parseInt(data.bid);
            if (current) {
                User.get(data.userName).then(function (found) {
                    if (found && found.coins >= data.bid) {
                        validateMin = !current.winningBid && current.minValue <= data.bid;
                        validateWin = current.winningBid && current.winningBid < data.bid;

                        if (validateMin || validateWin) {
                            current.winningBid = data.bid;
                            current.winningBidder = data.userName;
                            // adjust master clock if necessary
                            if (current.timeRemaining < Constants.TIMEOUT_CALLOUT) {
                                current.timeRemaining += 10;
                            }
                            // tell listeners to adjust their clocks & other displayed information
                            io.emit('auction:bid', current);
                            console.log('New bid: ' + prettyPrint(current));
                        }
                    }
                });
            }
        });

        // log out current user from all sessions
        socket.on('user:logout', function (userName) {
            // again should login flag be checked here before broadcast?
            socket.broadcast.emit('user:logout', userName);
            console.log('Logged out: ' + userName);
        });
    }
};