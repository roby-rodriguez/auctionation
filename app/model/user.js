/**
 * User model
 */
var Database = require('./database');

function build(userName) {
    return {
        name: userName,
        coins: 1000,
        inventory: {
            bread: 30,
            carrot: 18,
            diamond: 1
        }
        //loggedIn: false
    };
}

function find(userName) {
    return Database.connect().then(function (database) {
        return database.collection('user')
            .find({ name: userName })
            .limit(1)
            .next();
    });
}

function add(user) {
    return Database.connect().then(function (database) {
        return database.collection('user')
            .insertOne(user);
    });
}

function update(userName, data) {
    return Database.connect().then(function (database) {
        return database.collection('user')
            .updateOne({ name: userName }, { $set: data });
    });
}

function updateAuctioner(auction) {
    return find(auction.userName).then(function (found) {
        found.inventory[auction.type] -= auction.quantity;
        return update(auction.userName, {
            coins: found.coins + auction.winningBid,
            inventory: found.inventory
        });
    });
}

function updateBidder(auction) {
    return find(auction.winningBidder).then(function (found) {
        found.inventory[auction.type] += auction.quantity;
        return update(auction.winningBidder, {
            coins: found.coins - auction.winningBid,
            inventory: found.inventory
        });
    });
}

module.exports = {
    login: function (req, res, next) {
        var userName = req.body.name;
        if (!userName)
            return res.status(401).json({message: 'Empty credentials'});

        return find(userName).then(function (found) {
            if (!found) {
                var user = build(userName);
                return add(user).then(function () {
                    return res.json(user);
                }, function (err) {
                    return res.status(401).json({message: 'Could not add new user: ' + err});
                });
            }
            return res.json(found);
        }, function (err) {
            return res.status(401).json({message: 'User not found: ' + err});
        });
    },
    updateUserStats: function (auction) {
        return updateAuctioner(auction).then(function () {
            return updateBidder(auction);
        });
    },
    get: function (userName) {
        return find(userName);
    },
    checkAllowedBid: function (userName, bidValue) {
        return find(userName).then(function (found) {
            return found ? (found.coins >= bidValue) : false;
        });
    }
};