angular.module('twitterClone').component('tweetComponent', {

    templateUrl: './js/states/session/tweet/tweetTemplate.html',
    controller: 'tweetController',
    bindings: {
        content: '='
    }

})