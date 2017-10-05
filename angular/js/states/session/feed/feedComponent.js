angular.module('twitterClone').component('feedComponent', {

    templateUrl: './js/states/session/feed/feedTemplate.html',
    controller: 'feedController',
    bindings: {
        content: '=',
        replyContent: '='
    }

})