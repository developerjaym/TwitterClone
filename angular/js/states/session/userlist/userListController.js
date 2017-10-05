angular.module('twitterClone').controller('userListController', ['userListService', 'userDataService', '$state',
    function (userListService, userDataService, $state) {

        this.userPool = []

        this.switchFeed = (userListType, dependency) => {
            switch (userListType) {
                case userDataService.userListTypeEnum.ALL:
                    // dependency isn't needed here, gets all users
                    this.userPool = []
                    userListService.getAllUsers().then((succeedResponse) => {
                        this.userPool = succeedResponse.data
                        this.configureUserFields()
                    })
                    break;
                case userDataService.userListTypeEnum.CUSTOM:
                    // dependency is the pool of users
                    if (dependency !== undefined) {
                        this.userPool = dependency
                        this.configureUserFields()
                    }
                    break;
                case userDataService.userListTypeEnum.SINGLE:
                    // dependency here is the user to display
                    if (dependency !== undefined) {
                        this.userPool = [dependency]
                        this.configureUserFields()
                    }
                    break;
                case userDataService.userListTypeEnum.FOLLOWERS:
                    // dependency here would be the user whose followers we want
                    // if no dependency, then uses the logged in user as source
                    this.userPool = []
                    userListService.getFollowers(dependency).then((succeedResponse) => {
                        this.userPool = succeedResponse.data
                        this.configureUserFields()
                    }, (errorResponse) => {
                        if (errorResponse.status === 404) {
                            // Source user not found
                        }
                    })
                    break;
                case userDataService.userListTypeEnum.FOLLOWING:
                    // dependency here would be the source user
                    // if no dependency, then uses the logged in user as source
                    this.userPool = []
                    userListService.getFollowing(dependency).then((succeedResponse) => {
                        this.userPool = succeedResponse.data
                        this.configureUserFields()
                    }, (errorResponse) => {
                        if (errorResponse.status === 404) {
                            // Source user not found
                        }
                    })
                    break;
                default:
                    alert('Misspelled userListTypeEnum')
                    break;
            }
        }

        this.configureUserFields = () => {
            userListService.getFollowing().then((usersSourceIsFollowing) => {
                this.userPool.forEach((user) => {
                    user.followed = false
                    user.followedStyle = 'black'
                    user.followedText = 'Follow'

                    usersSourceIsFollowing.data.forEach((followedUser) => {
                        if (user.username === followedUser.username) {
                            user.followed = true
                            user.followedStyle = 'red'
                            user.followedText = 'Unfollow'
                        }
                    })
                })
            })
        }

        this.followUser = (user) => {
            if (user.followed) {
                userListService.unfollowUser(user.username).then((succeedResponse) => {
                    userDataService.followingNum--
                    user.followed = false
                    user.followedStyle = 'black'
                    user.followedText = 'Follow'
                })
            } else {
                userListService.followUser(user.username).then((succeedResponse) => {
                    userDataService.followingNum++
                    user.followed = true
                    user.followedStyle = 'red'
                    user.followedText = 'Unfollow'
                })
            }
        }

        if (userDataService.loggedIn()) {
            this.switchFeed(userDataService.activeUserList, userDataService.userListDependency)
        } else {
            $state.go('title.login')
        }
    }
])