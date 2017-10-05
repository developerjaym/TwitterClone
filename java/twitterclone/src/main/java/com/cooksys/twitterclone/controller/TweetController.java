/**
 * 
 */
package com.cooksys.twitterclone.controller;

import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.twitterclone.dto.ContextDto;
import com.cooksys.twitterclone.dto.CredentialsDto;
import com.cooksys.twitterclone.dto.HashtagGetDto;
import com.cooksys.twitterclone.dto.TweetGetDto;
import com.cooksys.twitterclone.dto.TweetRepostDto;
import com.cooksys.twitterclone.dto.TweetSaveDto;
import com.cooksys.twitterclone.dto.UserGetDto;
import com.cooksys.twitterclone.exception.TwitterException;
import com.cooksys.twitterclone.service.TweetService;
import com.cooksys.twitterclone.service.ValidateService;

/**
 * @author Greg Hill
 *
 */
@RestController
@RequestMapping("/tweets/")
@CrossOrigin//(origins = "http://localhost:8080")
public class TweetController {
	
	private TweetService tweetService;
	
	private ValidateService validateService;
	
	private final TweetGetDto ERROR = null;
	
	private final TweetRepostDto ERROR_REPOST = null;

	private final ContextDto ERROR_CONTEXT = null;
	
	private final Set<TweetGetDto> ERROR_TSET = null;
	
	private final Set<UserGetDto> ERROR_USET = null;
	
	private final Set<HashtagGetDto> ERROR_HSET = null;

	/**
	 * Constructor injecting services
	 * @param tweetService
	 * @param validateService
	 */
	public TweetController(TweetService tweetService, ValidateService validateService) {
		this.tweetService = tweetService;
		this.validateService = validateService;
	}
	
	/**
	 * @return all tweets tracked by the server
	 */
	@GetMapping
	public Set<TweetGetDto> getTweets(HttpServletResponse response) {
		try {
			return tweetService.getTweets();
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_TSET;
		}
	}
	
	/**
	 * @param tweetSaveDto
	 * @param response
	 * @return tweet that was created
	 */
	@PostMapping
	public TweetGetDto postTweet(@RequestBody TweetSaveDto tweetSaveDto, HttpServletResponse response) {
		try {
			TweetGetDto postedTweet = tweetService.postTweet(tweetSaveDto);
			return postedTweet;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}

	/**
	 * @param id
	 * @param response
	 * @return tweet whose id matches the request
	 */
	@GetMapping("/{id}/")
	public TweetGetDto getTweet(@PathVariable Integer id, HttpServletResponse response) {
		try {
			TweetGetDto tweet = tweetService.getTweet(id);
			return tweet;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param id
	 * @param credentialsDto
	 * @param response
	 * @return a representation of the deleted tweet
	 */
	@PostMapping("delete/{id}/")
	public TweetGetDto deleteTweet(@PathVariable Integer id, @RequestBody CredentialsDto credentialsDto, HttpServletResponse response) {
		try {
			TweetGetDto deletedTweet = tweetService.deleteTweet(id, credentialsDto);
			return deletedTweet;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param id
	 * @param credentialsDto
	 * @param response
	 * @return the tweet that was liked by user
	 */
	@PostMapping("/{id}/like/")
	public TweetGetDto likeTweet(@PathVariable Integer id, @RequestBody CredentialsDto credentialsDto, HttpServletResponse response) {
		try {
			TweetGetDto likedTweet = tweetService.likeTweet(id, credentialsDto);
			return likedTweet;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param id
	 * @param tweetSaveDto
	 * @param response
	 * @return the reply created from the request
	 */
	@PostMapping("/{id}/reply/")
	public TweetGetDto replyToTweet(@PathVariable Integer id, @RequestBody TweetSaveDto tweetSaveDto, HttpServletResponse response) {
		try {
			TweetGetDto reply = tweetService.replyToTweet(id, tweetSaveDto);
			return reply;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param id
	 * @param credentialsDto
	 * @param response
	 * @return the repost information as well as a copy of the original post
	 */
	@PostMapping("/{id}/repost/")
	public TweetRepostDto repostOfTweet(@PathVariable Integer id, @RequestBody CredentialsDto credentialsDto, HttpServletResponse response) {
		try {
			TweetRepostDto repost = tweetService.repostOfTweet(id, credentialsDto);
			return repost;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_REPOST;
		}
	}

	/**
	 * @param id
	 * @param response
	 * @return all of the tags contained in the given tweet
	 */
	@GetMapping("/{id}/tags")
	public Set<HashtagGetDto> getTweetTags(@PathVariable Integer id, HttpServletResponse response) {
		try {
			validateService.getTweetExists(id);
			return tweetService.getTweetTags(id);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_HSET;
		}
	}

	/**
	 * @param id
	 * @param response
	 * @return all of the users that liked the given tweet
	 */
	@GetMapping("/{id}/likes")
	public Set<UserGetDto> getTweetLikes(@PathVariable Integer id, HttpServletResponse response) {
		try {
			validateService.getTweetExists(id);
			return tweetService.getTweetLikes(id);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_USET;
		}
	}

	/**
	 * @param id
	 * @param response
	 * @return all of the users in the current tweet chain and the current tweet
	 */
	@GetMapping("/{id}/context")
	public ContextDto getContext(@PathVariable Integer id, HttpServletResponse response) {
		try {
			validateService.getTweetExists(id);
			return tweetService.getContext(id);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_CONTEXT;
		}
	}

	/**
	 * @param id
	 * @param response
	 * @return all tweets that replied to the current tweet
	 */
	@GetMapping("/{id}/replies")
	public Set<TweetGetDto> getReplies(@PathVariable Integer id, HttpServletResponse response) {
		try {
			validateService.getTweetExists(id);
			return tweetService.getReplies(id);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_TSET;
		}
	}

	/**
	 * @param id
	 * @param response
	 * @return all tweets that are reposts of the current tweet
	 */
	@GetMapping("/{id}/reposts")
	public Set<TweetGetDto> getReposts(@PathVariable Integer id, HttpServletResponse response) {
		try {
			validateService.getTweetExists(id);
			return tweetService.getReposts(id);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_TSET;
		}
	}

	/**
	 * @param id
	 * @param response
	 * @return all users that are mentioned in the given tweet
	 */
	@GetMapping("/{id}/mentions")
	public Set<UserGetDto> getMentions(@PathVariable Integer id, HttpServletResponse response) {
		try {
			validateService.getTweetExists(id);
			return tweetService.getMentions(id);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_USET;
		}
	}
	
}
