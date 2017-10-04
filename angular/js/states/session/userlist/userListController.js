angular.module('twitterClone').controller('userListController', ['userListService', 'userDataService', '$state',
    function (userListService, userDataService, $state) {

        // The pool of users to display in the user list state
        this.userPool = []

        if (userDataService.credentials.username === undefined ||
            userDataService.credentials.password === undefined) {
            // User is not logged in
            $state.go('title.login')
        }

        this.switchFeed = (userListType, dependency) => {
            switch (userListType) {
                case userDataService.userListTypeEnum.ALL:
                    // dependency isn't needed here, gets all users
                    this.userPool = []
                    userListService.getAllUsers().then((succeedResponse) => {
                        this.userPool = succeedResponse.data
                    })
                    break;
                case userDataService.userListTypeEnum.CUSTOM:
                    // dependency is the pool of users
                    if (dependency !== undefined) {
                        this.userPool = dependency
                    }
                    break;
                case userDataService.userListTypeEnum.SINGLE:
                    // dependency here is the user to display
                    if (dependency !== undefined) {
                        this.userPool = [dependency]
                    }
                    break;
                case userDataService.userListTypeEnum.FOLLOWERS:
                    // dependency here would be the user whose followers we want
                    // if no dependency, then uses the logged in user as source
                    this.userPool = []
                    userListService.getFollowers(dependency).then((succeedResponse) => {
                        this.userPool = succeedResponse.data
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
                    }, (errorResponse) => {
                        if (errorResponse.status === 404) {
                            // Source user not found
                        }
                    })
                    break;
                default:
                    // Shouldn't happen unless we misspelled something
                    alert('Misspelled userListTypeEnum')
                    break;
            }
        }

        if (userDataService.credentials.username !== undefined &&
            userDataService.credentials.password !== undefined) {
            this.switchFeed(userDataService.activeUserList, userDataService.userListDependency)
        }
    }
])