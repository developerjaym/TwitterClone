angular.module('twitterClone').service('tweetService', ['userDataService', '$http', function (userDataService, $http) {

    this.createNewTweet = (tweet) => {
        return $http.post('http://localhost:8888/api/tweets/', tweet)
    }

}])