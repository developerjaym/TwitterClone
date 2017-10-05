angular.module('twitterClone').controller('sessionController', ['userDataService', 'userListService', 'feedService', '$state',
    function (userDataService, userListService, feedService, $state) {

        this.userDataService = userDataService

        this.search = ''

        this.submitSearch = (searchType) => {
            // Parse search and see if we can direct the user somewhere
            // If not, then change css border to red

            // Will either contain an array of users or tweets at the end
            let resultPool = []



            let arrayOfUsernames = []
            let arrayOfHashtags = []
            let arrayOfSearchWords = this.search.split(' ')

            arrayOfSearchWords.forEach((word) => {
                if (word.charAt(0) !== '#' && word.charAt(0) !== '@') {
                    arrayOfUsernames.push(word)
                } else if (word.charAt(0) === '@') {
                    let username = word.slice(1)
                    arrayOfUsernames.push(username)
                } else {
                    let label = word.slice(1)
                    arrayOfHashtags.push(label)
                }
            })

            if (searchType === 'USER') {
                arrayOfUsernames.forEach((username) => {
                    // Get users matching the username
                    // Adds each user to resultPool
                    userListService.getUser(username).then((succeedResponse) => {
                        resultPool.push(...succeedResponse.data)
                    })
                })

                this.search = ''
                this.goToCustomUserList(resultPool)
            } else if (searchType === 'TWEET') {
                arrayOfUsernames.forEach((username) => {
                    // Get tweets by mention
                    // Adds each tweet to resultPool
                    feedService.getTweets(username).then((succeedResponse) => {
                        resultPool.push(...succeedResponse.data)
                    })
                })

                arrayOfHashtags.forEach((hashtag) => {
                    // Get tweets by tag
                    // Adds each tweet to resultPool
                    feedService.getTweetsByHashtag(hashtag).then((succeedResponse) => {
                        resultPool.push(...succeedResponse.data)
                    })
                })

                this.search = ''
                this.goToCustomFeed(resultPool)
            } else {
                // Error, binary button is not one of the two valid states
                alert('Mispelled something or forgot a this. Probably a this. Check for a this. Greg.')
            }
        }

        this.goToMainFeed = () => {
            userDataService.feedDependency = undefined
            userDataService.activeFeed = userDataService.feedTypeEnum.MAIN
            userDataService.reloadIfNecessary('session.feed', 'My ')
        }


        this.goToCustomFeed = (resultPool) => {
            userDataService.activeFeed = userDataService.feedTypeEnum.CUSTOM
            userDataService.feedDependency = resultPool
            userDataService.reloadIfNecessary('session.feed', 'Search Result ')
        }

        this.goToTweet = () => {
            userDataService.reloadIfNecessary('session.tweet')
        }

        this.goToMeMentioned = () => {
            userListService.getMentions().then((succeedResponse) => {
                userDataService.activeFeed = userDataService.feedTypeEnum.CUSTOM
                userDataService.feedDependency = succeedResponse.data
                userDataService.reloadIfNecessary('session.feed', 'My Mentions ')
            })
        }

        this.goToCustomUserList = (resultPool) => {
            userDataService.activeUserList = userDataService.userListTypeEnum.CUSTOM
            userDataService.userListDependency = resultPool
            userDataService.reloadIfNecessary('session.userlist', 'User Search Results')
        }

        this.goToUsersUserList = () => {
            userDataService.userListDependency = undefined
            userDataService.activeUserList = userDataService.userListTypeEnum.ALL
            userDataService.reloadIfNecessary('session.userlist', 'All Users')
        }

        this.goToFollowersUserList = () => {
            userDataService.userListDependency = undefined
            userDataService.activeUserList = userDataService.userListTypeEnum.FOLLOWERS
            userDataService.reloadIfNecessary('session.userlist', 'My Followers')
        }

        this.goToFollowingUserList = () => {
            userDataService.userListDependency = undefined
            userDataService.activeUserList = userDataService.userListTypeEnum.FOLLOWING
            userDataService.reloadIfNecessary('session.userlist', 'Users I\'m Following')
        }

        this.goToAccount = () => {
            userDataService.reloadIfNecessary('session.account')
        }


        this.logout = () => {
            userDataService.logout()
            userDataService.reloadIfNecessary('title.login')
        }

        if (userDataService.loggedIn()) {
            userListService.getFollowers().then((succeedResponse) => {
                userDataService.followersNum = succeedResponse.data.length
            })

            userListService.getFollowing().then((succeedResponse) => {
                userDataService.followingNum = succeedResponse.data.length
            })
        } else {
            $state.go('title.login')
        }

    }
])