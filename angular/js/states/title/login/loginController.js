angular.module('twitterClone').controller('loginController', ['loginService', 'userDataService', '$state',
    function (loginService, userDataService, $state) {

        this.submission = {}
        this.submission.username = 'hey'
        this.submission.password = 'hey'

        if (this.submission.username !== '') {
            this.usernameError = false
        }

        if (this.submission.password !== '') {
            this.passwordError = false
        }

        this.login = () => {
            loginService.login(this.submission).then((data) => {
                userDataService.setUserCredentials(submission.username, submission.password)
                $state.go('session.feed')
            }, (error) => {
                // TODO: Link html borders to username and password error booleans

                if (error === 404) {
                    // Username not found, shows error on username field
                    this.submission.username = ''
                    this.submission.password = ''
                    this.usernameError = true
                    this.passwordError = false
                }

                if (error === 401) {
                    // Password not found, shows error on password field
                    this.submission.password = ''
                    this.usernameError = false
                    this.passwordError = true
                }

            })
        }

    }
])