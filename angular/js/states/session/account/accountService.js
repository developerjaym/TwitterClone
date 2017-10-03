angular.module('twitterClone').service('accountService', ['userDataService', function (userDataService) {

    this.deactivateUser = () => {
        return $http.delete('http://localhost:8888/api/users/@' + userDataService.credentials.username + '/',
            userDataService.credentials)
    }

    this.modifyProfile = (user) => {
        return $http.patch('http://localhost:8888/api/users/', user)
    }

}])