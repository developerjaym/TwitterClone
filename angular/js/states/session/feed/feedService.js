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

        this.likeTweet = (tweetId) => {
            return $http.post('http://localhost:8888/api/tweets/' + tweetId + '/like/', userDataService.credentials)
        }

        this.getTagsOfTweet = (tweetId) => {
            return $http.get('http://localhost:8888/api/tweets/' + tweetId + '/tags/')
        }

        this.getLikesOfTweet = (tweetId) => {
            return $http.get('http://localhost:8888/api/tweets/' + tweetId + '/likes/')
        }

        this.getContextOfTweet = (tweetId) => {
            return $http.get('http://localhost:8888/api/tweets/' + tweetId + '/context/')
        }

        this.getRepliesToTweet = (tweetId) => {
            return $http.get('http://localhost:8888/api/tweets/' + tweetId + '/replies/')
        }

        this.getRepostsOfTweet = (tweetId) => {
            return $http.get('http://localhost:8888/api/tweets/' + tweetId + '/reposts/')
        }

        this.getUserMentionsInTweet = (tweetId) => {
            return $http.get('http://localhost:8888/api/tweets/' + tweetId + '/mentions/')
        }

        this.getTweetsByHashtag = (hashtagLabel) => {
            return $http.get('http://localhost:8888/api/tags/' + hashtagLabel + '/')
        }

        this.getFeed = (username) => {
            if (username !== undefined) {
                return $http.get('http://localhost:8888/api/users/@' + username + '/feed/')
            } else {
                return $http.get('http://localhost:8888/api/users/@' + userDataService.credentials.username + '/feed/')
            }
        }

        this.getTweets = (username) => {
            if (username !== undefined) {
                return $http.get('http://localhost:8888/api/users/@' + username + '/tweets/')
            } else {
                return $http.get('http://localhost:8888/api/users/@' + userDataService.credentials.username + '/tweets/')
            }
        }

    }
])