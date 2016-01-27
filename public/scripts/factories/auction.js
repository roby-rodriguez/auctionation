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
        notYetExpired: function () {
            return auction && auction.timeRemaining > 0;
        },
        decrementTimeRemaining: function () {
            auction.timeRemaining--;
        },
        reset: function () {
            auction = null;
        }
    };
});