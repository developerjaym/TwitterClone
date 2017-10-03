angular.module('twitterClone').service('userListService', ['userDataService', '$http',
    function (userDataService, $http) {

        this.getAllUsers = () => {
            return $http.get('http://localhost:8888/api/users/')
        }

        this.getUser = (username) => {
            return $http.get('http://localhost:8888/api/users/@' + username + '/')
        }

        this.followUser = (usernameToFollow) => {
            return $http.post('http://localhost:8888/api/users/@' + username + '/follow/', userDataService.credentials)
        }

        this.unfollowUser = (usernameToUnfollow) => {
            return $http.post('http://localhost:8888/api/users/@' + username + '/unfollow/', userDataService.credentials)
        }

        this.getFollowers = (username) => {
            if (username !== undefined) {
                return $http.get('http://localhost:8888/api/users/@' + username + '/followers/')
            } else {
                return $http.get('http://localhost:8888/api/users/@' + userDataService.credentials.username + '/followers/')
            }
        }

        this.getFollowing = (username) => {
            if (username !== undefined) {
                return $http.get('http://localhost:8888/api/users/@' + username + '/following/')
            } else {
                return $http.get('http://localhost:8888/api/users/@' + userDataService.credentials.username + '/following/')
            }
        }

        this.getMentions = (username) => {
            if (username !== undefined) {
                return $http.get('http://localhost:8888/api/users/@' + username + '/mentions/')
            } else {
                return $http.get('http://localhost:8888/api/users/@' + userDataService.credentials.username + '/mentions/')
            }
        }

    }
])