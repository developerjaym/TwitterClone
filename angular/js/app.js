angular.module('twitterClone').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    const titleState = {
        name: 'title',
        url: '/title',
        component: 'titleComponent'
    }

    const loginState = {
        name: 'login',
        url: '/login',
        component: 'loginComponent'
    }

    const sessionState = {
        name: 'session',
        url: '/session',
        component: 'sessionComponent'
    }

    $urlRouterProvider.otherwise('/title')
}])