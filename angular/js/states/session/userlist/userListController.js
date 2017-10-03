angular.module('twitterClone').controller('userListController', ['userListService', 'userDataService',
    function (userListService, userDataService) {

        this.userListTypeEnum = {
            ALL,
            SINGLE,
            FOLLOWERS,
            FOLLOWING
        }

        this.switchFeed = (userListType, dependency) => {
            if (userListType !== undefined) {
                switch (userListType) {
                    case userListType.ALL:
                        // dependency isn't needed here, gets all users
                        break;
                    case userListType.SINGLE:
                        // dependency here the user to display
                        break;
                    case userListType.FOLLOWERS:
                        // dependency here would be the user whose followers we want
                        // if no dependency, then gets the uses the logged in user as source
                        break;
                    case userListType.FOLLOWING:
                        // dependency here would be the source user
                        // if no dependency, then gets the uses the logged in user as source
                        break;
                    default:
                        // Shouldn't happen unless we misspelled something
                        alert('Misspelled userListTypeEnum')
                        break;
                }
            }
        }

    }
])