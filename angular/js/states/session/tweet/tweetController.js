angular.module('twitterClone').controller('tweetController', ['tweetService', 'userDataService', '$state',
    function (tweetService, userDataService, $state) {

        this.content = ''

        this.createNewTweet = () => {

            let contentArray = []

            let contentArrayWords = this.content.split(" ")
            
            contentArrayWords = contentArrayWords.map((word) => {
                if (word.charAt(0) !== '#' && word.charAt(0) !== '@' && word.length >= 20) {
                    let slicedWord = ''
                    while(word.length >= 20) {
                        slicedWord += word.slice(0, 19) + '-\n'
                        word = word.slice(20, -1)
                    }
                    slicedWord += word.slice(0, -1)                    
                    return slicedWord
                } else {
                    return word
                }
            })
            
            
            tweetService.createNewTweet(userDataService.buildTweet(contentArrayWords.join(' '))).then((succeedResponse) => {
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