angular.module('twitterClone').service('userDataService', [function () {

    this.credentials = new Credentials(undefined, undefined)

    this.setThisUserCredentials = (username, password) => {
        credentials.username = username
        credentials.password = password
    }

    this.buildUser = (username, password, firstName, lastName, email, phone) => {
        const profile = new Profile(firstName, lastName, email, phone)
        const cred = new Credentials(username, password)

        return new User(profile, cred)
    }

    this.buildTweet = (content) => {
        return new Tweet(content, credentials)
    }

}])

class Profile {
    constructor(firstName, lastName, email, phone) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
    }
    getFirstName = () => this.firstName
    getLastName = () => this.lastName
    getEmail = () => this.email
    getPhone = () => this.phone
}

class User {
    constructor(profile, credentials) {
        this.profile = profile;
        this.credentials = credentials;
    }
    getProfile = () => this.profile
    getUsername = () => this.credentials.getUsername()
    getPassword = () => this.credentials.getPassword()
}

class Credentials {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    getUsername = () => this.username
    getPassword = () => this.password
}

class Tweet {
    constructor(content, credentials) {
        this.content = content;
        this.credentials = credentials;
    }
    getContent = () => this.content
    getUsername = () => this.credentials.getUsername()
    getPassword = () => this.credentials.getPassword()
}