angular.module('twitterClone').controller('feedController', ['feedService', 'userListService', 'userDataService', '$state',
    function (feedService, userListService, userDataService, $state) {

        this.getBackground = (tweet) => {
            if (tweet.repostOf)
                return 'radial-gradient(rgba(108, 43, 15, 0.95), rgba(158, 103, 63, 0.9))'
            else if (tweet.inReplyTo)
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
                    // dependency here would be the source tweet id
                    this.tweetPool = []
                    feedService.getContextOfTweet(dependency).then((succeedResponse) => {
                        this.tweetPool.push(...succeedResponse.data.before)
                        this.tweetPool.push(succeedResponse.data.target)
                        this.tweetPool.push(...succeedResponse.data.after)
                        this.configureTweetFields()
                    })
                    break;
                case userDataService.feedTypeEnum.USER:
                    // dependency here would be the username
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

                    let contentArrayWords = tweet.content.split(" ")

                    contentArrayWords = contentArrayWords.map((word) => {
                        if (word.charAt(0) !== '#' && word.charAt(0) !== '@' && word.length >= 30) {
                            let slicedWord = ''
                            while (word.length >= 30) {
                                slicedWord += word.slice(0, 29) + '-\n'
                                word = word.slice(30, -1)
                            }
                            slicedWord += word.slice(0, -1)
                            return slicedWord
                        } else {
                            return word
                        }
                    })

                    tweet.content = contentArrayWords.join(' ')
                })
            })
        }

        this.likeTweet = (tweet) => {
            feedService.likeTweet(tweet.id).then((succeedResponse) => {
                tweet.liked = true
                tweet.likedStyle = 'red'
                tweet.likedText = 'Unlike'
                tweet.likes += ' ' + userDataService.credentials.username
            }, (errorResponse) => {
                tweet.liked = false
                tweet.likedStyle = 'white'
                tweet.likedText = 'Like'
                if(tweet.likes.includes(userDataService.credentials.username)) {
                    let indexOfName = tweet.likes.indexOf(userDataService.credentials.username)
                    let newLikes  = tweet.likes.slice(0, indexOfName)
                    newLikes += tweet.likes.slice(indexOfName + userDataService.credentials.username.length, - 1)
                    tweet.likes = newLikes
                }
            })
        }

        this.goToUser = (user) => {
            userDataService.userListDependency = user
            userDataService.activeUserList = userDataService.userListTypeEnum.SINGLE
            userDataService.reloadIfNecessary('session.userlist', user.username)
        }

        this.findTweetsByTag = (tag) => {
            this.switchFeed(userDataService.feedTypeEnum.HASHTAG, tag)
        }

        this.findUserByMention = (mention) => {
            userListService.getUser(mention).then((succeedResponse) => {
                userDataService.activeUserList = userDataService.userListTypeEnum.SINGLE
                userDataService.userListDependency = succeedResponse.data
                userDataService.reloadIfNecessary('session.userlist', mention)
            })
        }

        this.goToContext = (tweetId) => {
            this.switchFeed(userDataService.feedTypeEnum.CONTEXT, tweetId)
        }

        this.repostTweet = (tweetId) => {
            new Audio('shriek.mp3').play()
            feedService.repostTweet(tweetId).then((succeedResponse) => {
                this.switchFeed(userDataService.feedTypeEnum.MAIN)
            }, (errorResponse) => {
                alert('Error: ' + errorResponse.status)
            })
        }

        this.replyToTweet = (tweet) => {
            if (this.replyContent.length < 255) {
                new Audio('shriek.mp3').play()
                feedService.replyToTweet(tweet.id, userDataService.buildTweet(this.replyContent)).then((succeedResponse) => {
                    this.switchFeed(userDataService.feedTypeEnum.MAIN)
                    this.replyContent = ''
                    tweet.visibility = true
                }, (errorResponse) => {
                    alert('Error: ' + errorResponse.status)
                })
            } else {
                this.replyContent = 'Your Message Is Too Long'
            }
        }

        this.replyToggle = (tweet) => {
            if (tweet.visibility) {
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