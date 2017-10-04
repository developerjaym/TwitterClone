angular.module('twitterClone').controller('accountController', ['userListService', 'accountService', 'userDataService', '$state',
    function (userListService, accountService, userDataService, $state) {

        if (userDataService.credentials.username === undefined ||
            userDataService.credentials.password === undefined) {
            // User is not logged in
            $state.go('title.login')
        }

        this.deactivateUser = () => {
            accountService.deactivateUser().then((succeedResponse) => {
                // User deactivated, add some confirmation here and then redirects to login
                userDataService.credentials.username = undefined
                userDataService.credentials.password = undefined
                $state.go('title.login')
            }, (errorResponse) => {
                // There should never really be an error here unless the user got to the account page without logging in
                if (errorResponse === 404) {
                    // User doesn't exist (but somehow is logged in)
                }

                if (errorResponse === 401) {
                    // Incorrect password (but somehow is logged in)
                }
            })
        }

        // Testing cases vvv
        this.submission = {}
        this.submission.username = userDataService.credentials.username
        this.submission.password = userDataService.credentials.password
        userListService.getUser(userDataService.credentials.username).then((succeedResponse) => {
            this.submission.firstName = succeedResponse.data.profile.firstName
            this.submission.lastName = succeedResponse.data.profile.lastName
            this.submission.email = succeedResponse.data.profile.email
            this.submission.phone = succeedResponse.data.profile.phone
        })

        this.modifyProfile = () => {
            const user = userDataService.buildUser(
                this.submission.username,
                this.submission.password,
                this.submission.firstName,
                this.submission.lastName,
                this.submission.email,
                this.submission.phone)

            accountService.modifyProfile(user).then((succeedResponse) => {
                // Profile information modified, reloads state to display new data? Does that make sense?
                // Probably, since profile info isn't kept locally, it requires a pull
                $state.reload()
            }, (errorResponse) => {
                // Since all non-null data is valid, and null data silently just doesn't change a field, these shouldnt trigger

                if (errorResponse === 404) {
                    // User doesn't exist (but is logged in somehow)
                }

                if (errorResponse === 401) {
                    // Password is incorrect (but is logged in somehow)
                }
            })
        }

    }
])