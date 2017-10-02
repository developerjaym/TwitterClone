angular.module('twitterClone').controller('loginController', ['loginService', '$state', function (loginService, $state) {

    this.loginService = loginService

    this.login = () => {
        loginService.login(this.submission).then((data) => {
            $state.go('session.feed')
        }, (error) => {
            // Change some html to make it clear that there was an error and clear fields
        })
    }

}])