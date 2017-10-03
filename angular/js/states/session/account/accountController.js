angular.module('twitterClone').controller('accountController', ['accountService', 'userDataService', '$state',
    function (accountService, userDataService, $state) {

        if (userDataService.credentials.username === undefined ||
            userDataService.credentials.password === undefined) {
            // User is not logged in
            $state.go('title.login')
        }

        this.deactivateUser = () => {
            accountService.deactivateUser().then((data) => {
                // User deactivated, add some confirmation here and then redirects to login
                $state.go('title.login')
            }, (error) => {
                // There should never really be an error here unless the user got to the account page without logging in
                if (error === 404) {
                    // User doesn't exist (but somehow is logged in)
                }

                if (error === 401) {
                    // Incorrect password (but somehow is logged in)
                }
            })
        }

        // Testing cases vvv
        this.submission = {}
        this.submission.username = userDataService.credentials.username
        this.submission.password = userDataService.credentials.password
        this.submission.firstName = 'modified'
        this.submission.lastName = 'modified'
        this.submission.email = 'modified'
        this.submission.phone = 'modified'

        this.modifyProfile = () => {
            const user = userDataService.buildUser(
                this.submission.username,
                this.submission.password,
                this.submission.firstName,
                this.submission.lastName,
                this.submission.email,
                this.submission.phone)

            accountService.modifyProfile(user).then((data) => {
                // Profile information modified, reloads state to display new data? Does that make sense?
                // Probably, since profile info isn't kept locally, it requires a pull
                $state.reload()
            }, (error) => {
                // Since all non-null data is valid, and null data silently just doesn't change a field, these shouldnt trigger

                if (error === 404) {
                    // User doesn't exist (but is logged in somehow)
                }

                if (error === 401) {
                    // Password is incorrect (but is logged in somehow)
                }
            })
        }

    }
])