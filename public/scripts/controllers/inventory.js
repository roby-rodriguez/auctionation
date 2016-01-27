'use strict';

/**
 * @ngdoc function
 * @name auctionation.controller:InventoryCtrl
 * @description
 * # InventoryCtrl
 * Controller of auctionation
 */
angular.module('auctionation')
    .controller('InventoryCtrl', function($scope, $modal, socket, LoginFactory, InventoryPopupFactory) {

        $scope.user = LoginFactory.getUser();
        $scope.items = initInventory();
        
        $scope.createAuction = function (item) {
            socket.emit('auction:new', {
                userName: $scope.user.name,
                type: item.type,
                quantity: item.auction.quantity,
                minValue: item.auction.minValue
            });
            // cleanup
            item.auction = {};
        };

        $scope.showPopup = function (item) {
            InventoryPopupFactory.setSelectedItem(item);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/dashboard/auction/createAuction.html',
                controller: 'InventoryPopupCtrl',
                size: 'lg'
            });
            modalInstance.result.then(function (selectedItem) {
                if (selectedItem)
                    $scope.createAuction(selectedItem);
            });
        };

        function initInventory() {
            var items = [];
            for (var prop in $scope.user.inventory) {
                items.push({
                    type: prop,
                    quantity: $scope.user.inventory[prop],
                    auction: {}
                });
            }
            return items;
        }
    })
    .controller('InventoryPopupCtrl', function($scope, $modalInstance, LoginFactory, InventoryPopupFactory) {
        $scope.selectedItem = InventoryPopupFactory.getSelectedItem();
        $scope.user = LoginFactory.getUser();

        $scope.createAuction = function () {
            delete $scope.alert;
            // assure submitted fields are not empty
            if ($scope.selectedItem.auction.quantity && $scope.selectedItem.auction.minValue) {
                if ($scope.selectedItem.quantity < $scope.selectedItem.auction.quantity) {
                    var id = 'modalalert';
                    $scope.alert = {
                        type: 'warning',
                        title: 'New auction',
                        message: "You can't auction more than you own",
                        id: id
                    };
                    $scope.$apply();
                    createAlert(id);
                } else {
                    // update display and user stats
                    $scope.selectedItem.quantity -= $scope.selectedItem.auction.quantity;
                    $scope.user.inventory[$scope.selectedItem.type] = $scope.selectedItem.quantity;
                    $modalInstance.close($scope.selectedItem);
                }
            }
        };

        $scope.hidePopup = function () {
            $modalInstance.close();
        };

    })
    .factory('InventoryPopupFactory', function () {
        var selectedItem;
        return {
            setSelectedItem: function (item) {
                selectedItem = item;
            },
            getSelectedItem: function () {
                return selectedItem;
            }
        };
    });