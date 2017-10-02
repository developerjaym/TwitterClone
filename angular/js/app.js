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
//     const menuState = {
//         name: 'menu',
//         url: '/menu',
//         component: 'menuComponent'
//     }
    const sessionState = {
        name: 'session',
        url: '/session',
        component: 'sessionComponent'
    }
//     // const highscoreState = {
//     //     name: 'highscore',
//     //     url: '/highscore',
//     //     component: 'highscoreComponent'
//     // }
    $stateProvider.state(titleState)
    $stateProvider.state(loginState)
//     $stateProvider.state(menuState)
    $stateProvider.state(sessionState)
//     // $stateProvider.state(highscoreState)
    $urlRouterProvider.otherwise('/session')
}])