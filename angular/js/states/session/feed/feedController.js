angular.module('twitterClone').controller('feedController', ['feedService', 'userDataService',
    function (feedService, userDataService) {

        this.feedTypeEnum = {
            MAIN,
            CONTEXT,
            USER,
            HASHTAG
        }

        this.switchFeed = (feedType, dependency) => {
            if (feedType !== undefined) {
                switch (feedType) {
                    case feedTypeEnum.MAIN:
                        // dependency isn't needed here, gets current user's feed
                        break;
                    case feedTypeEnum.CONTEXT:
                        // dependency here would be the tweet
                        break;
                    case feedTypeEnum.USER:
                        // dependency here would be the user
                        break;
                    case feedTypeEnum.HASHTAG:
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