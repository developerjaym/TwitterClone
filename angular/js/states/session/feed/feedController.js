angular.module('twitterClone').controller('feedController', ['feedService', 'userListService', 'userDataService', '$state',
    function (feedService, userListService, userDataService, $state) {

        this.userListService = userListService

        // Pool of tweets to display in feed
        this.tweetPool = []

        // Content of a reply tweet
        this.content = ''

        if (userDataService.credentials.username === undefined ||
            userDataService.credentials.password === undefined) {
            // User is not logged in
            $state.go('title.login')
        }

        this.switchFeed = (feedType, dependency) => {
            switch (feedType) {
                case userDataService.feedTypeEnum.MAIN:
                    // dependency isn't needed here, gets current user's feed
                    this.tweetPool = []
                    feedService.getLikesOfUser().then((succeedResponse) => {
                        return succeedResponse
                    }).then((listOfTweetsAsPromiseResult) => {
                        feedService.getFeed().then((succeedResponse) => {
                            this.tweetPool = succeedResponse.data
                            this.tweetPool.forEach((tweet) => {
                                listOfTweetsAsPromiseResult.data.forEach((likedTweet) => {
                                    if (tweet.id === likedTweet.id) {
                                        tweet.liked = true
                                    }
                                })
                            })
                        })
                    })
                    break;
                case userDataService.feedTypeEnum.CUSTOM:
                    // dependency is the pool of users
                    if (dependency !== undefined) {
                        this.tweetPool = dependency
                    }
                    break;
                case userDataService.feedTypeEnum.SINGLE:
                    // dependency here would be the tweet to display
                    if (dependency !== undefined) {
                        this.tweetPool = [dependency]
                    }
                    break;
                case userDataService.feedTypeEnum.CONTEXT:
                    // dependency here would be the source tweet
                    this.tweetPool = []
                    feedService.getContextOfTweet(dependency).then((succeedResponse) => {
                        this.tweetPool = succeedResponse.data
                    }, (errorResponse) => {
                        if (errorResponse.status === 404) {
                            // Tweet not found
                        }
                    })
                    break;
                case userDataService.feedTypeEnum.USER:
                    // dependency here would be the user
                    this.tweetPool = []
                    feedService.getTweets(dependency).then((succeedResponse) => {
                        this.tweetPool = succeedResponse.data
                    }, (errorResponse) => {
                        if (errorResponse.status === 404) {
                            // Not found
                        }
                    })
                    break;
                case userDataService.feedTypeEnum.HASHTAG:
                    // dependency here would be the hashtag
                    this.tweetPool = []
                    feedService.getTweetsByHashtag(dependency).then((succeedResponse) => {
                        this.tweetPool = succeedResponse.data
                    }, (errorResponse) => {
                        if (errorResponse.status === 404) {
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

        this.styleIfLiked = (tweet) => {
            if (tweet.liked !== undefined &&
                tweet.liked) {
                return 'gray'
            } else {
                return 'white'
            }
        }

        this.textIfLiked = (tweet) => {
            if (tweet.liked !== undefined &&
                tweet.liked) {
                return 'Liked'
            } else {
                return 'Like'
            }
        }

        this.likeTweet = (tweet) => {
            feedService.likeTweet(tweet.id).then((succeedResponse) => {
                tweet.liked = true
            }, (errorResponse) => {
                alert('Error: ' + errorResponse.status)
            })
        }

        this.repostTweet = (tweetId) => {
            feedService.repostTweet(tweetId).then((succeedResponse) => {
                this.switchFeed(userDataService.feedTypeEnum.MAIN)
            }, (errorResponse) => {
                alert('Error: ' + errorResponse.status)
            })
        }

        // TODO: Pop up input field on reply click. Ng-model this.content to it. On enter or second reply button run this method
        this.replyToTweet = () => {
            feedService.replyToTweet(this.content).then((succeedResponse) => {
                this.switchFeed(userDataService.feedTypeEnum.MAIN)
            }, (errorResponse) => {
                alert('Error: ' + errorResponse.status)
            })
        }

        this.deleteTweet = (tweetId) => {
            feedService.deleteTweet(tweetId).then((succeedResponse) => {
                this.switchFeed(userDataService.feedTypeEnum.MAIN)
            }, (errorResponse) => {
                alert('Error: ' + errorResponse.status)
            })
        }

        if (userDataService.credentials.username !== undefined &&
            userDataService.credentials.password !== undefined) {
            this.switchFeed(userDataService.activeFeed, userDataService.feedDependency)
        }

    }
])