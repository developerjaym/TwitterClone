angular.module('twitterClone').service('userDataService', ['$state', function ($state) {

    this.credentials = new Credentials(undefined, undefined)

    this.setUserCredentials = (username, password) => {
        this.credentials.username = username
        this.credentials.password = password
    }

    this.loggedIn = () => (this.credentials.username !== undefined && this.credentials.password !== undefined)

    this.followersNum = 0
    this.followingNum = 0

    this.sessionTitleEnum = {
        FEED: 'Feed',
        USERS: 'Users',
        ACCOUNT: 'Account',
        FOLLOWERS: 'Followers',
        FOLLOWING: 'Following',
        SEARCH: 'Search Results'
    }

    this.sessionTitle = this.sessionTitleEnum.FEED;

    this.setSessionTitle = (sessionType, optionalPrefix) => {
        if (optionalPrefix === undefined) {
            optionalPrefix = ''
        }

        this.sessionTitle = optionalPrefix + sessionType;
    }

    this.logout = () => {
        this.credentials.username = undefined
        this.credentials.password = undefined
    }

    this.buildUser = (username, password, firstName, lastName, email, phone) => {
        const cred = new Credentials(username, password)
        const profile = new Profile(firstName, lastName, email, phone)

        return new User(cred, profile)
    }

    this.buildTweet = (content) => {
        return new Tweet(content, this.credentials)
    }

    this.feedTypeEnum = {
        MAIN: 'MAIN',
        CUSTOM: 'CUSTOM',
        SINGLE: 'SINGLE',
        CONTEXT: 'CONTEXT',
        USER: 'USER',
        HASHTAG: 'HASHTAG'
    }

    this.activeFeed = this.feedTypeEnum.MAIN
    this.feedDependency = undefined

    this.userListTypeEnum = {
        ALL: 'ALL',
        CUSTOM: 'CUSTOM',
        SINGLE: 'SINGLE',
        FOLLOWERS: 'FOLLOWERS',
        FOLLOWING: 'FOLLOWING'
    }

    this.activeUserList = this.userListTypeEnum.ALL
    this.userListDependency = undefined

    this.reloadIfNecessary = (stateName, optionalPrefix) => {

        switch (stateName) {
            case 'session.tweet':
                this.setSessionTitle('Compose Tweet')
                break;
            case 'session.account':
                this.setSessionTitle('My Account')
                break;
            case 'session.userlist':
                this.setSessionTitle('', optionalPrefix)
                break;
            case 'session.feed':
                this.setSessionTitle('Feed', optionalPrefix)
                break;
            default:
                break;
        }

        if ($state.is(stateName)) {
            $state.reload()
        } else {
            $state.go(stateName)
        }
    }

}])

class Profile {
    constructor(firstName, lastName, email, phone) {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.phone = phone
    }

    getFirstName() {
        this.firstName
    }
    getLastName() {
        this.lastName
    }
    getEmail() {
        this.email
    }
    getPhone() {
        this.phone
    }
}

class User {
    constructor(credentials, profile) {
        this.credentials = credentials
        this.profile = profile
    }

    getProfile() {
        this.profile
    }
    getCredentials() {
        this.credentials
    }
}

class Credentials {
    constructor(username, password) {
        this.username = username
        this.password = password
    }

    getUsername() {
        this.username
    }
    getPassword() {
        this.password
    }
}

class Tweet {
    constructor(content, credentials) {
        this.content = content
        this.credentials = credentials
    }

    getContent() {
        this.content
    }
    getUsername() {
        this.credentials.getUsername()
    }
    getPassword() {
        this.credentials.getPassword()
    }
}