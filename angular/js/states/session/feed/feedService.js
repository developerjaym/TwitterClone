angular.module('twitterClone').service('feedService', ['userDataService', '$http',
    function ($http, userDataService) {

        this.getAllTweets = () => {
            return $http.get('http://localhost:8888/api/tweets/')
        }

        this.getTweet = (tweetId) => {
            return $http.get('http://localhost:8888/api/tweets/' + tweetId + '/')
        }

        this.deleteTweet = (tweetId) => {
            return $http.delete('http://localhost:8888/api/tweets/' + tweetId + '/', userDataService.credentials)
        }

        this.deleteTweet = (tweetId) => {
            return $http.post('http://localhost:8888/api/tweets/' + tweetId + '/like/', userDataService.credentials)
        }

    }
])