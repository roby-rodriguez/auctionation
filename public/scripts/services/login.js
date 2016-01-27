/**
 * Login Service
 */
angular.module('auctionation').service('LoginService', function($http, LoginFactory) {

    this.login = function (user, next) {
        // do we really need return here?
        return $http.post('/login', user).success(function(loggedInUser){
            LoginFactory.setUser(loggedInUser);
            next();
        });
    };

});