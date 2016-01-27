'use strict';

/**
 * @ngdoc overview
 * @name auctionation
 * @description
 * # auctionation
 *
 * Main module of the application.
 */
angular
    .module('auctionation', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate'
    ])
    .filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    })
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/dashboard', '/dashboard/playerStats');
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('base', {
                abstract: true,
                url: '',
                templateUrl: 'views/base.html'
            })
            .state('login', {
                url: '/login',
                parent: 'base',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                parent: 'base',
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .state('playerStats', {
                url: '/playerStats',
                parent: 'dashboard',
                templateUrl: 'views/dashboard/playerStats.html',
                controller: 'PlayerStatsCtrl'
            })
            .state('inventory', {
                url: '/inventory',
                parent: 'dashboard',
                templateUrl: 'views/dashboard/inventory.html',
                controller: 'InventoryCtrl'
            })
            .state('currentAuction', {
                url: '/currentAuction',
                parent: 'dashboard',
                templateUrl: 'views/dashboard/currentAuction.html',
                controller: 'CurrentAuctionCtrl'
            });

    });