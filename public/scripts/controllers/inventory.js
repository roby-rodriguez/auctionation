/**
 * @ngdoc function
 * @name auctionation.controller:InventoryCtrl
 * @description
 * # InventoryCtrl
 * Controller of auctionation
 */
angular.module('auctionation')
    .controller('InventoryCtrl', function($scope, $uibModal, socket, LoginFactory, InventoryPopupFactory) {

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
            var modalInstance = $uibModal.open({
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
    .controller('InventoryPopupCtrl', function($scope, $uibModalInstance, LoginFactory, InventoryPopupFactory) {
        $scope.selectedItem = InventoryPopupFactory.getSelectedItem();
        $scope.user = LoginFactory.getUser();
        $scope.alert = {
            type: 'warning',
            title: 'New auction',
            message: "You can't auction more than you own",
            id: 'modalalert'
        };

        $scope.createAuction = function () {
            // assure submitted fields are not empty
            var quantity = parseInt($scope.selectedItem.auction.quantity),
                minValue = parseInt($scope.selectedItem.auction.minValue);
            if (isNaN(quantity) || isNaN(minValue)) {
                $scope.alert.message = "Wrong input!";
                showPopup();
            } else {
                if ($scope.selectedItem.quantity < quantity) {
                    showPopup();
                } else {
                    // update display and user stats
                    $scope.selectedItem.quantity -= quantity;
                    $scope.user.inventory[$scope.selectedItem.type] = $scope.selectedItem.quantity;
                    $uibModalInstance.close($scope.selectedItem);
                }
            }
        };

        $scope.hidePopup = function () {
            $uibModalInstance.close();
        };

        function showPopup() {
            $scope.selectedItem.auction = {};
            createAlert($scope.alert.id);
        }
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