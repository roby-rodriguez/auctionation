'use strict';

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
    });