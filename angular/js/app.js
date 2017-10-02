angular.module('twitterClone', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    const titleState = {
        name: 'title',
        url: '/title',
        component: 'titleComponent'
    }

    const loginState = {
        name: 'login',
        url: '/title/login',
        component: 'loginComponent'
    }

    const newUserState = {
        name: 'newuser',
        url: '/title/newuser',
        component: 'newUserComponent'
    }

    const sessionState = {
        name: 'session',
        url: '/session',
        component: 'sessionComponent'
    }

    const accountState = {
        name: 'account',
        url: '/session/account',
        component: 'accountComponent'
    }

    const feedState = {
        name: 'feed',
        url: '/session/feed',
        component: 'feedComponent'
    }

    const tweetState = {
        name: 'tweet',
        url: '/session/tweet',
        component: 'tweetComponent'
    }

    const userListState = {
        name: 'userlist',
        url: '/session/userlist',
        component: 'userListComponent'
    }

    $stateProvider.state(titleState)

    $urlRouterProvider.otherwise('/title')
}])