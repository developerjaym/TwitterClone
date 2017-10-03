angular.module('twitterClone').controller('newUserController', ['newUserService', 'userDataService', '$state',
    function (newUserService, userDataService, $state) {

        // Testing cases vvv
        this.submission = {}
        // this.submission.username = 'testUser22'
        // this.submission.password = 'testUser22'
        // this.submission.firstName = 'testUser'
        // this.submission.lastName = 'testUser'
        // this.submission.email = 'testUser'
        // this.submission.phone = 'testUser'

        this.usernameErrorCss = "black"
        this.passwordErrorCss = "black"
        this.emailErrorCss = "black"

        this.createNewUser = () => {
            if (this.submission.username !== '' &&
                this.submission.password !== '' &&
                this.submission.email !== '') {

                const user = userDataService.buildUser(
                    this.submission.username,
                    this.submission.password,
                    this.submission.firstName,
                    this.submission.lastName,
                    this.submission.email,
                    this.submission.phone)

                newUserService.createNewUser(user).then((succeedResponse) => {
                    // User created, data will contain dto of user without its password
                    $state.go('title.login')
                }, (errorResponse) => {
                    if (errorResponse.status === 409) {
                        // Username taken
                        this.submission.username = ''
                        this.usernameErrorCss = "red"
                        this.passwordErrorCss = "black"
                        this.emailErrorCss = "black"
                    }

                    if (errorResponse.status === 406) {
                        // Required field missing
                        this.usernameErrorCss = "red"
                        this.passwordErrorCss = "red"
                        this.emailErrorCss = "red"
                    }

                    if (errorResponse.status === 401) {
                        // Tried to reactivate account and password incorrect
                        this.submission.password = ''
                        this.passwordErrorCss = "red"
                        this.usernameErrorCss = "black"
                        this.emailErrorCss = "black"
                    }
                })
            }
        }
    }
])