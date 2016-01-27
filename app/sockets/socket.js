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
                    User.updateAuctioner(current);
                    User.updateBidder(current);
                    // ideally only participants should be updated, for the purpose of this project -> update all
                    io.emit('user:update', current);
                }
                // reset values
                current = null;
            } else {
                current.timeRemaining--;
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
                quantity: data.quantity,
                minValue: data.minValue,
                //winningBid: data.minValue,
                timeRemaining: Constants.TIMEOUT
            };
            auctions.push(newAuction);
            console.log('Added new auction: ' + prettyPrint(newAuction));
        });

        // announce new logged in users of ongoing auctions
        socket.on('auction:check', function (userName) {
            User.setLoggedIn(userName);
            if (current) {
                socket.emit('auction:new', current);
            }
            // log out current user from any other browser sessions
            if (User.isLoggedIn(userName)) {
                socket.broadcast.emit('user:logout', userName);
                console.log('Logged out: ' + userName);
            }
            console.log('Auction check: ' + prettyPrint(current) + ' user: ' + userName);
        });

        // broadcast new bids
        socket.on('auction:bid', function (data) {
            // if there's an auction going on and this is the highest bid so far
            if (current) {// && (!current.winningBid || current.winningBid < data.bid)) {
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
        });

        // log out current user from all sessions
        socket.on('user:logout', function (userName) {
            if (User.isLoggedIn(userName)) {
                socket.broadcast.emit('user:logout', userName);
                console.log('Logged out: ' + userName);
            }
        });
    }
};