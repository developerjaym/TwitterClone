angular.module('twitterClone', ['ui.router', 'xeditable']).run(function (editableOptions) {
    editableOptions.theme = 'bs3';
}).config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        const titleState = {
            abstract: true,
            name: 'title',
            url: '/title',
            component: 'titleComponent'
        }

        const loginState = {
            name: 'title.login',
            url: '/login',
            component: 'loginComponent'
        }

        const newUserState = {
            name: 'title.newuser',
            url: '/newuser',
            component: 'newUserComponent'
        }

        const sessionState = {
            abstract: true,
            name: 'session',
            url: '/session',
            component: 'sessionComponent'
        }

        // url: '/session/{username}',

        const accountState = {
            name: 'session.account',
            url: '/account',
            params: {
                param1: 'username'
            },
            component: 'accountComponent'
        }

        const feedState = {
            name: 'session.feed',
            url: '/feed',
            component: 'feedComponent'
        }

        const tweetState = {
            name: 'session.tweet',
            url: '/tweet',
            component: 'tweetComponent'
        }

        const userListState = {
            name: 'session.userlist',
            url: '/userlist',
            component: 'userListComponent'
        }

        $stateProvider.state(titleState)
            .state(loginState)
            .state(newUserState)
            .state(sessionState)
            .state(accountState)
            .state(feedState)
            .state(tweetState)
            .state(userListState)

        $urlRouterProvider.otherwise('/title/login')
    }
])
