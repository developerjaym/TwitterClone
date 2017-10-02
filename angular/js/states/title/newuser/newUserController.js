angular.module('twitterClone').controller('newUserController', ['newUserService', function (newUserService) {

    this.newUserService = newUserService
    
        this.login = () => {
            loginService.login(this.submission).then((data) => {
                $state.go('session.feed')
            }, (error) => {
                // Change some html to make it clear that there was an error and clear fields
            })
        }

}])