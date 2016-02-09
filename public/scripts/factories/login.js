/**
 * Login Factory
 */
angular.module('auctionation').factory('LoginFactory', function () {
    var currentUser = {};
    var lastBid;

    return {
        setUser: function(user) {
            currentUser = user;
        },
        getUser: function() {
            return currentUser;
        },
        updateCoins: function (bidValue) {
            if (!lastBid) {
                // no previous bid
                lastBid = bidValue;
                currentUser.coins -= bidValue;
            } else {
                currentUser.coins -= (bidValue - lastBid);
                lastBid = bidValue;
            }
        }
    };
});