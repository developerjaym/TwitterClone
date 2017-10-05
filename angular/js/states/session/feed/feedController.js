angular.module('twitterClone').controller('feedController', ['feedService', 'userListService', 'userDataService', '$state',
    function (feedService, userListService, userDataService, $state) {

        this.getBackground = (tweet)=>{
            if(tweet.repostOf)
                return 'radial-gradient(rgba(108, 43, 15, 0.95), rgba(158, 103, 63, 0.9))'
            else if(tweet.inReplyTo)
                return 'radial-gradient(rgba(70, 52, 30, 0.95), rgba(135, 90, 70, 0.9))'
            else
                return ''    
        }

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
                    })
                    break;
                case userDataService.feedTypeEnum.USER:
                    // dependency here would be the user
                    this.tweetPool = []
                    feedService.getTweets(dependency).then((succeedResponse) => {
                        this.tweetPool = succeedResponse.data
                        this.configureTweetFields()
                    })
                    break;
                case userDataService.feedTypeEnum.HASHTAG:
                    // dependency here would be the hashtag
                    this.tweetPool = []
                    feedService.getTweetsByHashtag(dependency).then((succeedResponse) => {
                        this.tweetPool = succeedResponse.data
                        this.configureTweetFields()
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
                    tweet.liked = false
                    tweet.likedStyle = 'white'
                    tweet.likedText = 'Like'
                    tweet.visibility = true

                    userLikedTweets.data.forEach((likedTweet) => {
                        if (tweet.id === likedTweet.id) {
                            tweet.liked = true
                            tweet.likedStyle = 'red'
                            tweet.likedText = 'Unlike'
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

        this.likeTweet = (tweet) => {
            feedService.likeTweet(tweet.id).then((succeedResponse) => {
                tweet.liked = true
                tweet.likedStyle = 'red'
                tweet.likedText = 'Unlike'
            }, (errorResponse) => {
                tweet.liked = false
                tweet.likedStyle = 'white'
                tweet.likedText = 'Like'
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

        this.replyToTweet = (tweetId) => {
            feedService.replyToTweet(tweetId, userDataService.buildTweet(this.replyContent)).then((succeedResponse) => {
                this.switchFeed(userDataService.feedTypeEnum.MAIN)
                this.replyContent = ''
                tweet.visibility = true
            }, (errorResponse) => {
                alert('Error: ' + errorResponse.status)
            })
        }

        this.replyToggle = (tweet) => {
            if(tweet.visibility) {
                tweet.visibility = false
            } else {
                tweet.visibility = true
            }
        }

        this.deleteTweet = (tweetId) => {
            feedService.deleteTweet(tweetId).then((succeedResponse) => {
                this.switchFeed(userDataService.feedTypeEnum.MAIN)
            })
        }

        if (userDataService.loggedIn()) {
            this.switchFeed(userDataService.activeFeed, userDataService.feedDependency)
        } else {
            $state.go('title.login')
        }
    }



])