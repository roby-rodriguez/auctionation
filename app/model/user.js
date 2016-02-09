/**
 * User model
 */
var users = [{
    name: 'john',
    coins: 1200,
    inventory: {
        bread: 24,
        carrot: 22,
        diamond: 1
    },
    loggedIn: false
}];

function addNewUser(name) {
    var newUser = {
        name: name,
        coins: 1000,
        inventory: {
            bread: 30,
            carrot: 18,
            diamond: 1
        },
        loggedIn: false
    };
    users.push(newUser);
    return newUser;
}

function getUser(name) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].name === name)
            return users[i];
    }
}

module.exports = {
    login: function (req, res, next) {
        var userName = req.body.name;
        if (!userName)
            return res.status(401).json({message: 'Empty credentials'});

        var user = getUser(userName);
        if (!user) user = addNewUser(userName);
        user.loggedIn = true;
        return res.json(user);
    },
    isLoggedIn: function (userName) {
        var user = getUser(userName);
        return user ? user.loggedIn : false;
    },
    setLoggedIn: function (userName) {
        var user = getUser(userName);
        user.loggedIn = true;
    },
    updateAuctioner: function (auction) {
        var user = getUser(auction.userName);
        user.coins += auction.winningBid;
        user.inventory[auction.type] -= auction.quantity;
    },
    updateBidder: function (auction) {
        var user = getUser(auction.winningBidder);
        user.coins -= auction.winningBid;
        user.inventory[auction.type] += auction.quantity;
    },
    checkAllowedBid: function (userName, bidValue) {
        var user = getUser(userName);
        return user.coins >= bidValue;
    }
};