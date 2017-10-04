/**
 * 
 */
package com.cooksys.twitterclone.service;

import org.springframework.stereotype.Service;

import com.cooksys.twitterclone.dto.CredentialsDto;
import com.cooksys.twitterclone.entity.HashtagEntity;
import com.cooksys.twitterclone.entity.TweetEntity;
import com.cooksys.twitterclone.entity.UserEntity;
import com.cooksys.twitterclone.entity.embeddable.CredentialsEmbeddable;
import com.cooksys.twitterclone.exception.ErrorType;
import com.cooksys.twitterclone.exception.TwitterException;
import com.cooksys.twitterclone.repository.HashtagJpaRepository;
import com.cooksys.twitterclone.repository.TweetJpaRepository;
import com.cooksys.twitterclone.repository.UserJpaRepository;

/**
 * @author Greg Hill
 *
 */
@Service
public class ValidateService {
	
	private HashtagJpaRepository hashtagJpaRepository;
	
	private UserJpaRepository userJpaRepository;
	
	private TweetJpaRepository tweetJpaRepository;
	
	private final TweetEntity ERROR_TWEET = null;
	
	private final HashtagEntity ERROR_TAG = null;
	
	private final UserEntity ERROR_USER = null;
	
	private final String ERROR_STRING = null;
	
	private final CredentialsEmbeddable ERROR_CRED = null;

	/**
	 * Constructor injecting repositories
	 * @param hashtagJpaRepository
	 * @param userJpaRepository
	 * @param tweetJpaRepository
	 */
	public ValidateService(HashtagJpaRepository hashtagJpaRepository, UserJpaRepository userJpaRepository, TweetJpaRepository tweetJpaRepository) {
		this.hashtagJpaRepository = hashtagJpaRepository;
		this.userJpaRepository = userJpaRepository;
		this.tweetJpaRepository = tweetJpaRepository;
	}
	
	/**
	 * @param credentials
	 * @throws TwitterException
	 */
	public void login(CredentialsDto credentials) throws TwitterException {
		UserEntity user = pullUser(credentials.getUsername());
		
		if(!user.getCredentials().getPassword().equals(credentials.getPassword())) {
			throw new TwitterException(ErrorType.NOT_AUTHORIZED);
		}
		
		if(!user.getActive()) {
			throw new TwitterException(ErrorType.NOT_FOUND);
		}
	}
	
	/**
	 * @param username
	 * @return a user by username
	 * @throws TwitterException 
	 */
	public UserEntity pullUser(String username) throws TwitterException {
		UserEntity user = userJpaRepository.findByCredentialsUsername(username);
		if(user == null) {
			throw new TwitterException(ErrorType.NOT_FOUND);
		}
		return user;
	}
	
	/**
	 * @param label
	 * @return a hashtag by label
	 * @throws TwitterException 
	 */
	public HashtagEntity pullTag(String label) throws TwitterException {
		HashtagEntity tag = hashtagJpaRepository.findByLabel(label);
		if(tag == ERROR_TAG) {
			throw new TwitterException(ErrorType.NOT_FOUND);
		}
		return tag;
	}

	/**
	 * @param id
	 * @return a tweet by id
	 * @throws TwitterException 
	 */
	public TweetEntity pullTweet(Integer id) throws TwitterException {
		TweetEntity tweet = tweetJpaRepository.findOne(id);
		if(tweet == ERROR_TWEET) {
			throw new TwitterException(ErrorType.NOT_FOUND);
		}
		return tweet;
	}
	
	/**
	 * @param label
	 * @return whether or not the given label is associated with a hashtag in the database
	 * @throws TwitterException 
	 */
	public Boolean getTagExists(String label) {
		try {
			pullTag(label);
			return true;
		} catch (TwitterException twitterException) {
			return false;
		}
	}
	
	/**
	 * @param id
	 * @return whether or not the given tweet exists in the database and is active
	 * @throws TwitterException 
	 */
	public Boolean getTweetExists(Integer id) throws TwitterException {
		return pullTweet(id) != ERROR_TWEET && pullTweet(id).getActive();
	}
	
	/**
	 * @param username
	 * @return true if there was never a user with this username, false otherwise
	 * @throws TwitterException 
	 */
	public Boolean getUsernameAvailable(String username) {
		try {
			pullUser(username);
			return false;
		} catch (TwitterException twitterException) {
			return true;
		}
	}

	/**
	 * @param username
	 * @return true if the user is in the database and is currently active, false otherwise
	 * @throws TwitterException 
	 */
	public Boolean getUsernameExists(String username) {
		try {
			return pullUser(username).getActive();
		} catch (TwitterException twitterException) {
			return false;
		}
	}

	/**
	 * @param username
	 * @return true if the user is in the database and is currently inactive, false otherwise
	 * @throws TwitterException 
	 */
	public Boolean getUsernameInactive(String username) {
		try {
			return !pullUser(username).getActive();
		} catch (TwitterException twitterException) {
			return false;
		}
	}

	/**
	 * @param credentials
	 * @return true if the credentials match a user in the database, false otherwise
	 * @throws TwitterException 
	 */
	public Boolean validateCredentials(CredentialsEmbeddable credentials) throws TwitterException {
		UserEntity user = pullUser(credentials.getUsername());
		return (user != ERROR_USER) ? user.getCredentials().getPassword().equals(credentials.getPassword()) :  false;
	}

	/**
	 * @param user
	 * @return true if the user has valid information in all required fields, false otherwise
	 */
	public Boolean validUserFields(UserEntity user) {
		return !(user.getCredentials() == ERROR_CRED ||
			user.getCredentials().getUsername() == ERROR_STRING ||
			user.getCredentials().getPassword() == ERROR_STRING ||
			user.getProfile().getEmail() == ERROR_STRING);
	}

	/**
	 * @param tweet
	 * @return validates the fields of the new tweet
	 */
	public Boolean validTweetFields(TweetEntity tweet) {
		return tweet.getContent() != ERROR_STRING;
	}
	
}
