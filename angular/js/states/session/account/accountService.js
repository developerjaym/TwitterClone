angular.module('twitterClone').service('accountService', ['userDataService', '$http', function (userDataService, $http) {

    this.deactivateUser = () => {
        return $http.post('http://localhost:8888/api/users/delete/@' + userDataService.credentials.username + '/',
            userDataService.credentials)
    }

    this.modifyProfile = (user) => {
        return $http.patch('http://localhost:8888/api/users/@' + userDataService.credentials.username + '/', user)
    }

}])