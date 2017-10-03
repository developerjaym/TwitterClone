angular.module('twitterClone').controller('userListController', ['userListService', 'userDataService', '$state',
    function (userListService, userDataService, $state) {

        // The pool of users to display in the user list state
        this.userPool = []

        if (userDataService.credentials.username === undefined ||
            userDataService.credentials.password === undefined) {
            // User is not logged in
            $state.go('title.login')
        }

        this.userListTypeEnum = {
            ALL: 'ALL',
            SINGLE: 'SINGLE',
            FOLLOWERS: 'FOLLOWERS',
            FOLLOWING: 'FOLLOWING'
        }

        this.switchFeed = (userListType, dependency) => {
            switch (userListType) {
                case this.userListTypeEnum.ALL:
                    // dependency isn't needed here, gets all users
                    this.userPool = []
                    userListService.getAllUsers().then((succeedResponse) => {
                        this.userPool = succeedResponse.data
                    })
                    break;
                case this.userListTypeEnum.SINGLE:
                    // dependency here the user to display
                    this.userPool = [dependency]
                    break;
                case this.userListTypeEnum.FOLLOWERS:
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
                case this.userListTypeEnum.FOLLOWING:
                    // dependency here would be the source user
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
                default:
                    // Shouldn't happen unless we misspelled something
                    alert('Misspelled userListTypeEnum')
                    break;
            }
        }

        if (userDataService.credentials.username !== undefined) {
            this.switchFeed(this.userListTypeEnum.ALL)
        }

    }
])