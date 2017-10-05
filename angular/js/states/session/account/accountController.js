angular.module('twitterClone').controller('accountController', ['userListService', 'accountService', 'userDataService', '$state',
    function (userListService, accountService, userDataService, $state) {

        this.deactivateUser = () => {
            accountService.deactivateUser().then((succeedResponse) => {
                userDataService.credentials.username = undefined
                userDataService.credentials.password = undefined
                $state.go('title.login')
            })
        }

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
                $state.reload()
            })
        }

        if (!userDataService.loggedIn()) {
            $state.go('title.login')
        }

    }
])