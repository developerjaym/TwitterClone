angular.module('twitterClone').controller('feedController', ['feedService', 'userListService', 'userDataService', '$state',
    function (feedService, userListService, userDataService, $state) {

        // Pool of tweets to display in feed
        this.tweetPool = []

        if (userDataService.credentials.username === undefined ||
            userDataService.credentials.password === undefined) {
            // User is not logged in
            $state.go('title.login')
        }

        this.feedTypeEnum = {
            MAIN: 'ALL',
            SINGLE: 'SINGLE',
            CONTEXT: 'CONTEXT',
            USER: 'USER',
            HASHTAG: 'HASHTAG'
        }

        this.switchFeed = (feedType, dependency) => {
            if (feedType !== undefined) {
                switch (feedType) {
                    case this.feedTypeEnum.MAIN:
                        // dependency isn't needed here, gets current user's feed
                        this.tweetPool = []
                        feedService.getFeed(userDataService.credentials.username).then((succeedResponse) => {
                            tweetPool = succeedResponse.data
                        })
                        break;
                    case this.feedTypeEnum.SINGLE:
                        // dependency here would be the tweet to display
                        this.tweetPool = [dependency]
                        break;
                    case this.feedTypeEnum.CONTEXT:
                        // dependency here would be the source tweet
                        this.tweetPool = []
                        feedService.getContextOfTweet(dependency).then((succeedResponse) => {
                            tweetPool = succeedResponse.data
                        }, (errorResponse) => {
                            if (errorResponse === 404) {
                                // Tweet not found
                            }
                        })
                        break;
                    case this.feedTypeEnum.USER:
                        // dependency here would be the user
                        this.tweetPool = []
                        feedService.getTweets(dependency).then((succeedResponse) => {
                            tweetPool = succeedResponse.data
                        }, (errorResponse) => {
                            if (errorResponse === 404) {
                                // Not found
                            }
                        })
                        break;
                    case this.feedTypeEnum.HASHTAG:
                        // dependency here would be the hashtag
                        this.tweetPool = []
                        feedService.getTweetsByHashtag(dependency).then((succeedResponse) => {
                            tweetPool = succeedResponse.data
                        }, (errorResponse) => {
                            if (errorResponse === 404) {
                                // Not found
                            }
                        })
                        break;
                    default:
                        // Shouldn't happen unless we misspelled something
                        alert('Misspelled feedTypeEnum')
                        break;
                }
            }
        }

    }
])