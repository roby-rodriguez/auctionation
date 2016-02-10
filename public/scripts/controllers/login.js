/**
 * @ngdoc function
 * @name auctionation.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of auctionation
 */
angular.module('auctionation')
    .controller('LoginCtrl', function($scope, $location, LoginService) {
        $scope.user = {};

        $scope.login = function() {
            LoginService.login($scope.user, function () {
                return $location.path('/dashboard');
            }).error(function (err) {
                $scope.error = err;
            });
        }

    });