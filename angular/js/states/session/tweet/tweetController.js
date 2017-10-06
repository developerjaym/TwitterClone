angular.module('twitterClone').controller('tweetController', ['tweetService', 'userDataService', '$state',
    function (tweetService, userDataService, $state) {

        this.content = ''

        this.createNewTweet = () => {
            if (this.content.length < 255) {
                new Audio('shriek.mp3').play()
                tweetService.createNewTweet(userDataService.buildTweet(this.content)).then((succeedResponse) => {
                    userDataService.activeFeed = userDataService.feedTypeEnum.MAIN
                    userDataService.feedDependency = undefined
                    userDataService.reloadIfNecessary('session.feed', 'My ');
                }, (errorResponse) => {
                    alert('Error: ' + errorResponse.status)
                })
            } else {
                this.content = 'Your Message Is Too Long'
            }
        }

        if (!userDataService.loggedIn()) {
            $state.go('title.login')
        }
    }
])