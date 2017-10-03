angular.module('twitterClone').controller('feedController', ['feedService', 'userDataService', '$state',
    function (feedService, userDataService, $state) {

        if (userDataService.credentials.username === undefined ||
            userDataService.credentials.password === undefined) {
            // User is not logged in
            $state.go('title.login')
        }

        this.feedTypeEnum = {
            MAIN: 'ALL',
            CONTEXT: 'CONTEXT',
            USER: 'USER',
            HASHTAG: 'HASHTAG'
        }

        this.switchFeed = (feedType, dependency) => {
            if (feedType !== undefined) {
                switch (feedType) {
                    case this.feedTypeEnum.MAIN:
                        // dependency isn't needed here, gets current user's feed
                        break;
                    case this.feedTypeEnum.CONTEXT:
                        // dependency here would be the tweet
                        break;
                    case this.feedTypeEnum.USER:
                        // dependency here would be the user
                        break;
                    case this.feedTypeEnum.HASHTAG:
                        // dependency here would be the hashtag
                        break;
                    default:
                        // Shouldn't happen unless we misspelled something
                        alert('Misspelled feedTypeEnum')
                        break;
                }
            }
        }

    }
])