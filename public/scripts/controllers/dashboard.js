/**
 * @ngdoc function
 * @name auctionation.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of auctionation
 */
angular.module('auctionation')
    .controller('DashboardCtrl', function($rootScope, $scope, $state, $location, socket, AuctionFactory, LoginFactory, LoginService) {
        var timer;
        $scope.$state = $state;
        // check server for any ongoing auctions
        socket.emit('auction:check', LoginFactory.getUser().name);

        socket.on('auction:new', function (auction) {
            console.log('auction:new ' + prettyPrint(auction));
            $scope.alert = { type: 'info', title: 'New auction', message: prettyPrint(auction) };
            createAlert();

            AuctionFactory.setAuction(auction);
            $rootScope.$broadcast('auctionChanged', $scope.alert);
        });

        socket.on('auction:bid', function (auction) {
            console.log('auction:bid ' + auction);
            $scope.alert = { type: 'info', title: 'New bid', message: prettyPrint(auction) };
            createAlert();

            // update current auction fields
            AuctionFactory.setAuction(auction);
            $rootScope.$broadcast('auctionChanged', $scope.alert);
        });

        socket.on('auction:closed', function (auction) {
            console.log('auction:closed ' + auction);
            $scope.alert = { type: 'info', title: 'Auction closed', message: prettyPrint(auction) };
            createAlert();

            AuctionFactory.reset();
            $rootScope.$broadcast('auctionChanged', $scope.alert);
        });

        // don't know how clever this is but it does the job for now
        socket.on('user:logout', function (userName) {
            if (userName == LoginFactory.getUser().name) {
                console.log('user:logout');
                $location.url('/login');
            }
        });

        socket.on('user:update', function () {
            console.log('user:update');
            LoginService.login(LoginFactory.getUser(), function () {
                $scope.alert = { type: 'info', title: 'User update', message: 'User stats have been updated' };
                createAlert();
                $rootScope.$broadcast('updateStats', $scope.alert);
            }).error(function (err) {
                $scope.alert = { type: 'error', title: 'User update', message: err };
                createAlert();
            });
        });

        socket.on('time:update', function (timeRemaining) {
            AuctionFactory.setTimeRemaining(timeRemaining);
            if (timeRemaining < 10)
                showTimeRunningLow(timeRemaining);
            else
                // not very efficient
                showTimeRunningLow();
        });

        $scope.logout = function () {
            // request log out from all sessions
            socket.emit('user:logout', LoginFactory.getUser().name);
        }
  });
