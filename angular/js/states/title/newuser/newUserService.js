angular.module('twitterClone').service('newUserService', ['$http', function ($http) {

    this.createNewUser = (user) => {
        return $http.post('http://localhost:8888/api/users/', user)
    }

}])