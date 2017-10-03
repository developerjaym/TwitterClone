angular.module('twitterClone').service('userDataService', [function () {

    this.credentials = new Credentials(undefined, undefined)
    // this.credentials = new Credentials('guest', 'guest')

    this.setUserCredentials = (username, password) => {
        this.credentials.username = username
        this.credentials.password = password
    }

    this.buildUser = (username, password, firstName, lastName, email, phone) => {
        const cred = new Credentials(username, password)
        const profile = new Profile(firstName, lastName, email, phone)

        return new User(cred, profile)
    }

    this.buildTweet = (content) => {
        return new Tweet(content, credentials)
    }

}])

class Profile {
    constructor(firstName, lastName, email, phone) {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.phone = phone
    }

    getFirstName() { this.firstName }
    getLastName() { this.lastName }
    getEmail() { this.email }
    getPhone() { this.phone }
}

class User {
    constructor(credentials, profile) {
        this.credentials = credentials
        this.profile = profile
    }

    getProfile() { this.profile }
    getCredentials() { this.credentials }
}

class Credentials {
    constructor(username, password) {
        this.username = username
        this.password = password
    }

    getUsername() { this.username }
    getPassword() { this.password }
}

class Tweet {
    constructor(content, credentials) {
        this.content = content
        this.credentials = credentials
    }

    getContent() { this.content }
    getUsername() { this.credentials.getUsername() }
    getPassword() { this.credentials.getPassword() }
}