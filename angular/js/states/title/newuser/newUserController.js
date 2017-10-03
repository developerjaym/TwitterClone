angular.module('twitterClone').controller('newUserController', ['newUserService', 'userDataService', '$state',
    function (newUserService, userDataService, $state) {

        // Testing cases vvv
        this.submission = {}
        this.submission.username = 'testUser22'
        this.submission.password = 'testUser22'
        this.submission.firstName = 'testUser'
        this.submission.lastName = 'testUser'
        this.submission.email = 'testUser'
        this.submission.phone = 'testUser'

        if (this.submission.username !== '') {
            this.usernameError = false
        }

        if (this.submission.password !== '') {
            this.passwordError = false
        }

        if (this.submission.email !== '') {
            this.emailError = false
        }

        this.createNewUser = () => {
            const user = userDataService.buildUser(
                this.submission.username,
                this.submission.password,
                this.submission.firstName,
                this.submission.lastName,
                this.submission.email,
                this.submission.phone)

            newUserService.createNewUser(user).then((data) => {
                // User created, data will contain dto of user without its password
                $state.go('title.login')
            }, (error) => {
                // Change some html to make it clear that there was an error and clear fields

                if(error === 409) {
                    // Username taken
                    this.submission.username = ''
                    this.usernameError = true
                }

                if(error === 406) {
                    // Required field missing
                }
                
                if(error === 401) {
                    // Tried to reactivate account and password incorrect
                    this.submission.password = ''
                    this.usernameError = false
                    this.passwordError = true
                }
            })
        }

        // this.createNewUser()

    }
])