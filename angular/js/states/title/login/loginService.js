angular.module('twitterClone').service('loginService', ['$http', function ($http) {

    this.login = (submission) => {
        return $http.post('http://localhost:8888/api/validate/login/', submission)
    }

}])