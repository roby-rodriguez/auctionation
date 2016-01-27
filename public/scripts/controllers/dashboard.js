'use strict';

/**
 * @ngdoc function
 * @name auctionation.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of auctionation
 */
angular.module('auctionation')
    .controller('DashboardCtrl', function($rootScope, $scope, $state, $location, $timeout, socket, AuctionFactory, LoginFactory, LoginService) {
        var timer;
        $scope.$state = $state;
        // check server for any ongoing auctions
        socket.emit('auction:check', LoginFactory.getUser().name);

        socket.on('auction:new', function (auction) {
            console.log('auction:new ' + prettyPrint(auction));
            $scope.alert = { type: 'info', title: 'New auction', message: prettyPrint(auction) };
            createAlert();

            AuctionFactory.setAuction(auction);
            $rootScope.$broadcast('auctionChanged', []);
            // start display timer
            timer = $timeout($scope.onTimeout, 1000);
        });

        socket.on('auction:bid', function (auction) {
            console.log('auction:bid ' + auction);
            $scope.alert = { type: 'info', title: 'New bid', message: prettyPrint(auction) };
            createAlert();

            // update current auction fields
            AuctionFactory.setAuction(auction);
            $rootScope.$broadcast('auctionChanged', []);
        });

        socket.on('auction:closed', function (auction) {
            console.log('auction:closed ' + auction);
            $scope.alert = { type: 'info', title: 'Auction closed', message: prettyPrint(auction) };
            createAlert();

            AuctionFactory.reset();
            $rootScope.$broadcast('auctionChanged', []);
        });

        // don't know how clever this is but it does the job for now
        socket.on('user:logout', function (userName) {
            if (userName == LoginFactory.getUser().name) {
                console.log('user:logout');
                $location.url('/login');
            }
        });

        socket.on('user:update', function () {
            LoginService.login(LoginFactory.getUser(), function () {
                $scope.alert = { type: 'info', title: 'User update', message: 'User stats have been updated' };
                createAlert();
            }).error(function (err) {
                $scope.alert = { type: 'error', title: 'User update', message: err };
                createAlert();
            });
        });

        // create a simple timer to display current auction remaining time for bidding
        $scope.onTimeout = function () {
            if (AuctionFactory.notYetExpired()) {
                AuctionFactory.decrementTimeRemaining();
                timer = $timeout($scope.onTimeout, 1000);
            } else {
                AuctionFactory.reset();
            }
        };

        $scope.logout = function () {
            // request log out from all sessions
            socket.emit('user:logout', LoginFactory.getUser().name);
        }
  });