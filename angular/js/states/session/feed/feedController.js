angular.module('twitterClone').controller('feedController', ['feedService', 'userListService', 'userDataService', '$state',
    function (feedService, userListService, userDataService, $state) {

        this.userListService = userListService
        this.tweetPool = []
        this.content = ''

        this.switchFeed = (feedType, dependency) => {
            switch (feedType) {
                case userDataService.feedTypeEnum.MAIN:
                    // dependency isn't needed here, gets current user's feed
                    this.tweetPool = []
                    feedService.getFeed().then((succeedResponse) => {
                        this.tweetPool = succeedResponse.data
                        this.configureTweetFields()
                    })
                    break;
                case userDataService.feedTypeEnum.CUSTOM:
                    // dependency is the pool of users
                    if (dependency !== undefined) {
                        this.tweetPool = dependency
                        this.configureTweetFields()
                    }
                    break;
                case userDataService.feedTypeEnum.SINGLE:
                    // dependency here would be the tweet to display
                    if (dependency !== undefined) {
                        this.tweetPool = [dependency]
                        this.configureTweetFields()
                    }
                    break;
                case userDataService.feedTypeEnum.CONTEXT:
                    // dependency here would be the source tweet
                    this.tweetPool = []
                    feedService.getContextOfTweet(dependency).then((succeedResponse) => {
                        this.tweetPool.push(...succeedResponse.data.before)
                        this.tweetPool.push(succeedResponse.data.target)
                        this.tweetPool.push(...succeedResponse.data.after)
                        this.configureTweetFields()
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
                        this.configureTweetFields()
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
                        this.configureTweetFields()
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

        this.configureTweetFields = () => {
            feedService.getLikesOfUser().then((userLikedTweets) => {
                this.tweetPool.forEach((tweet) => {
                    tweet.mentions = []
                    tweet.tags = []

                    userLikedTweets.data.forEach((likedTweet) => {
                        if (tweet.id === likedTweet.id) {
                            tweet.liked = true
                        }
                    })

                    feedService.getUserMentionsInTweet(tweet.id).then((succeedResponse) => {
                        succeedResponse.data.forEach((user) => {
                            if (user.username !== '') {
                                tweet.mentions.push(user.username)
                            }
                        })
                    })

                    feedService.getTagsOfTweet(tweet.id).then((succeedResponse) => {
                        succeedResponse.data.forEach((tag) => {
                            if (tag.label !== '') {
                                tweet.tags.push(tag.label)
                            }
                        })
                    })
                })
            })
        }

        this.styleIfLiked = (tweet) => {
            if (tweet.liked !== undefined &&
                tweet.liked) {
                return 'red'
            } else {
                return 'white'
            }
        }

        this.textIfLiked = (tweet) => {
            if (tweet.liked !== undefined &&
                tweet.liked) {
                return 'Unlike'
            } else {
                return 'Like'
            }
        }

        this.likeTweet = (tweet) => {
            feedService.likeTweet(tweet.id).then((succeedResponse) => {
                tweet.liked = true
            }, (errorResponse) => {
                tweet.liked = false
            })
        }

        this.findTweetsByTag = (tag) => {
            this.switchFeed(userDataService.feedTypeEnum.HASHTAG, tag)
        }

        this.findUserByMention = (mention) => {
            userListService.getUser(mention).then((succeedResponse) => {
                userDataService.activeUserList = userDataService.userListTypeEnum.SINGLE
                userDataService.userListDependency = succeedResponse.data
                $state.go('session.userlist')
            })
        }

        this.goToContext = (tweetId) => {
            this.switchFeed(userDataService.feedTypeEnum.CONTEXT, tweetId)
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

        if (userDataService.loggedIn()) {
            this.switchFeed(userDataService.activeFeed, userDataService.feedDependency)
        } else {
            $state.go('title.login')
        }
    }
])