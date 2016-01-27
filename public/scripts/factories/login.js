/**
 * Login Factory
 */
angular.module('auctionation').factory('LoginFactory', function () {
    var currentUser = {};

    return {
        setUser: function(user) {
            currentUser = user;
        },
        getUser: function() {
            return currentUser;
        }
    };
});