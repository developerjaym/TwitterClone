angular.module('twitterClone').controller('tweetController', ['tweetService', 'userDataService', '$state',
    function (tweetService, userDataService, $state) {

        this.content = ''

        this.createNewTweet = () => {
            tweetService.createNewTweet(userDataService.buildTweet(this.content)).then((succeedResponse) => {
                userDataService.activeFeed = userDataService.feedTypeEnum.MAIN
                userDataService.feedDependency = undefined
                userDataService.reloadIfNecessary('session.feed', 'My ');
            }, (errorResponse) => {
                alert('Error: ' + errorResponse.status)
            })
        }

        if (!userDataService.loggedIn()) {
            $state.go('title.login')
        }
    }
])