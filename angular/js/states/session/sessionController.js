angular.module('twitterClone').controller('sessionController', ['userDataService', 'userListService', 'feedService', '$state',
    function (userDataService, userListService, feedService, $state) {

        this.search = ''
        this.toggle = 'user'

        if (userDataService.credentials.username === undefined ||
            userDataService.credentials.password === undefined) {
            // User is not logged in
            $state.go('title.login')
        }

        this.submitSearch = () => {
            // Parse search and see if we can direct the user somewhere
            // If not, then change css border to red

            // Will either contain an array of users or tweets at the end
            let resultPool = []

            let arrayOfSearchWords = this.search.split(' ')

            let arrayOfUsernames = arrayOfSearchWords.filter((word) => word.charAt(0) === '@')
            arrayOfUsernames = arrayOfUsernames.map((word) => word.slice(1))

            let arrayOfHashtags = arrayOfSearchWords.filter((word) => word.charAt(0) === '#')
            arrayOfHashtags = arrayOfHashtags.map((word) => word.slice(1))

            if (this.toggle === 'user') {
                arrayOfUsers.forEach((username) => {
                    // Get users matching the username
                    // Adds each user to resultPool
                    userListService.getUser(username).then((succeedResponse) => {
                        resultPool.push(succeedResponse.data)
                    })
                })

                this.search = ''
                this.goToCustomUserList(resultPool)
            } else if (this.toggle === 'tweet') {
                arrayOfUsers.forEach((username) => {
                    // Get tweets by mention
                    // Adds each tweet to resultPool
                    userListService.getMentions(username).then((succeedResponse) => {
                        resultPool.push(succeedResponse.data)
                    })
                })

                arrayOfHashtags.forEach((hashtag) => {
                    // Get tweets by tag
                    // Adds each tweet to resultPool
                    feedService.getTweetsByHashtag(hashtag).then((succeedResponse) => {
                        resultPool.push(succeedResponse.data)
                    })
                })

                this.search = ''
                this.goToCustomFeed(resultPool)
            } else {
                // Error, binary button is not one of the two valid states
                alert('Mispelled something or forgot a this. Probably a this. Check for a this. Greg.')
            }
        }

        this.goToCustomFeed = (resultPool) => {
            userDataService.activeFeed = userDataService.feedTypeEnum.CUSTOM
            userDataService.feedDependency = resultPool
            $state.go('session.feed')
        }

        this.goToMainFeed = () => {
            userDataService.activeFeed = userDataService.feedTypeEnum.MAIN
            $state.go('session.feed')
        }

        this.goToTweet = () => {
            $state.go('session.tweet')
        }

        this.goToCustomUserList = (resultPool) => {
            userDataService.activeUserList = userDataService.userListTypeEnum.CUSTOM
            userDataService.userListDependency = resultPool
            $state.go('session.userlist')
        }

        this.goToUsersUserList = () => {
            userDataService.activeUserList = userDataService.userListTypeEnum.ALL
            $state.go('session.userlist')
        }

        this.goToFollowersUserList = () => {
            userDataService.activeUserList = userDataService.userListTypeEnum.FOLLOWERS
            $state.go('session.userlist')
        }

        this.goToFollowingUserList = () => {
            userDataService.activeUserList = userDataService.userListTypeEnum.FOLLOWING
            $state.go('session.userlist')
        }

        this.goToAccount = () => {
            $state.go('session.tweet')
        }

    }
])