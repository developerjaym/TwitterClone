angular.module('twitterClone').controller('tweetController', ['tweetService', 'userDataService', '$state',
    function (tweetService, userDataService, $state) {

        this.content = ''

        if (userDataService.credentials.username === undefined ||
            userDataService.credentials.password === undefined) {
            // User is not logged in
            $state.go('title.login')
        }

        this.createNewTweet = () => {
            tweetService.createNewTweet(userDataService.buildTweet(this.content)).then((succeedResponse) => {
                $state.go('session.feed')
            }, (errorResponse) => {
                alert('Error: ' + errorResponse.status)
            })
        }

    }
])