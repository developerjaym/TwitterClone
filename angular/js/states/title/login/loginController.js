angular.module('twitterClone').controller('loginController', ['loginService', '$state', function (loginService, $state) {

    this.loginService = loginService

    this.login = () => {
        console.log("logging in")
        alert("logging in")

        loginService.login(this.submission).then((data) => {
            $state.go('session')
        }, (error) => {
            // Change some html to make it clear that there was an error and clear fields
        })
    }

}])