/**
 * @ngdoc function
 * @name auctionation.controller:PlayerStatsCtrl
 * @description
 * # PlayerStatsCtrl
 * Controller of auctionation
 */
angular.module('auctionation')
    .controller('PlayerStatsCtrl', function($scope, LoginFactory) {
        $scope.user = LoginFactory.getUser();

        $scope.$on('updateStats', function (evt, alert) {
            // FIXME this is ugly & retarded -> why the hell does ngular need this refresh?
            $scope.user = LoginFactory.getUser();
        });
    });