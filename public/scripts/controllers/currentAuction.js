'use strict';

/**
 * @ngdoc function
 * @name auctionation.controller:CurrentAuctionCtrl
 * @description
 * # CurrentAuctionCtrl
 * Controller of auctionation
 */
angular.module('auctionation')
    .controller('CurrentAuctionCtrl', function($rootScope, $scope, socket, LoginFactory, AuctionFactory) {

        $scope.user = LoginFactory.getUser();
        $scope.auction = AuctionFactory.getAuction();

        $scope.placeBid = function () {
            delete $scope.alert;
            var minBid = $scope.auction.winningBid ? $scope.auction.winningBid : $scope.auction.minValue;
            if ($scope.user.coins < minBid || $scope.user.coins < $scope.bid) {
                $scope.alert = {type: 'warning', title: 'New bid', message: "You don't have enough coins to bid"};
                createAlert();
            } else if ($scope.bid < minBid) {
                $scope.alert = {type: 'warning', title: 'New bid', message: "You can't bid less than current winner or minimum bid"};
                createAlert();
            } else {
                // update user stats in frontend
                $scope.user.coins -= $scope.bid;
                socket.emit('auction:bid', {
                    userName: $scope.user.name,
                    bid: $scope.bid
                });
            }
        };

        $scope.allowBidding = function () {
            return $scope.auction && $scope.auction.userName !== $scope.user.name;
        };

        $scope.$on('auctionChanged', function () {
            // this is retarded -> why the hell does ngular need this refresh?
            $scope.auction = AuctionFactory.getAuction();
        });
    });