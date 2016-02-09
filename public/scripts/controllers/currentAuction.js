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
            if ($scope.bid > $scope.user.coins) {
                // user tries to bid more than he owns
                $scope.alert = {type: 'warning', title: 'New bid', message: "You don't have enough coins to bid"};
                createAlert();
            } else if ($scope.bid < $scope.auction.minValue) {
                // first bid must be at least as high as the min value
                $scope.alert = {type: 'warning', title: 'New bid', message: "You can't bid less than the minimum bid"};
                createAlert();
            } else if ($scope.auction.winningBid && $scope.bid <= $scope.auction.winningBid) {
                // a winning bid already exists, so current bid must be higher
                $scope.alert = {type: 'warning', title: 'New bid', message: "You can't bid less than the current winner"};
                createAlert();
            } else {
                // valid bid - update user stats in frontend
                LoginFactory.updateCoins($scope.bid);
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