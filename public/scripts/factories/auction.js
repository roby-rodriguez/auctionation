/**
 * Auction Factory
 */
angular.module('auctionation').factory('AuctionFactory', function () {
    var auction;

    return {
        setAuction: function(currentAuction) {
            auction = currentAuction;
        },
        getAuction: function() {
            return auction;
        },
        setTimeRemaining: function (timeRemaining) {
            auction.timeRemaining = timeRemaining;
        },
        reset: function () {
            auction = null;
        }
    };
});