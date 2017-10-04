/**
 * 
 */
package com.cooksys.twitterclone.controller;

import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.twitterclone.dto.CredentialsDto;
import com.cooksys.twitterclone.dto.TweetGetDto;
import com.cooksys.twitterclone.dto.UserGetDto;
import com.cooksys.twitterclone.dto.UserSaveDto;
import com.cooksys.twitterclone.exception.TwitterException;
import com.cooksys.twitterclone.service.UserService;

/**
 * @author Greg Hill
 *
 */
@RestController
@RequestMapping("/users/")
@CrossOrigin(origins = "http://localhost:8080")
public class UserController {
	
	private UserService userService;
	
	private final UserGetDto SUCCESS = null;
	
	private final UserGetDto ERROR = null;
	
	private final Set<TweetGetDto> ERROR_TSET = null;
	
	private final Set<UserGetDto> ERROR_USET = null;

	/**
	 * Constructor injecting services
	 * @param userService
	 */
	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	/**
	 * @return all users tracked by the server
	 */
	@GetMapping
	public Set<UserGetDto> getUsers() {
		return userService.getUsers();
	}
	
	/**
	 * @param userSaveDto
	 * @param response
	 * @return a copy of the user created by the request
	 */
	@PostMapping
	public UserGetDto postUser(@RequestBody UserSaveDto userSaveDto, HttpServletResponse response) {
		try {
			UserGetDto createdUser = userService.postUser(userSaveDto);
			return createdUser;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}

	/**
	 * @param username
	 * @param response
	 * @return the user matching the username
	 */
	@GetMapping("/@{username}/")
	public UserGetDto getUser(@PathVariable String username, HttpServletResponse response) {
		try {
			UserGetDto user = userService.getUser(username);
			return user;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param username
	 * @param userSaveDto
	 * @param response
	 * @return the modified version of the user
	 */
	@PatchMapping("/@{username}/")
	public UserGetDto patchUser(@PathVariable String username, @RequestBody UserSaveDto userSaveDto, HttpServletResponse response) {
		try {
			UserGetDto patchedUser = userService.patchUser(username, userSaveDto);
			return patchedUser;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param username
	 * @param userSaveDto
	 * @param response
	 * @return the new user whose data has been overwritten
	 */
	@PutMapping("/@{username}/")
	public UserGetDto putUser(@PathVariable String username, @RequestBody UserSaveDto userSaveDto, HttpServletResponse response) {
		try {
			UserGetDto placedUser = userService.putUser(username, userSaveDto);
			return placedUser;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param username
	 * @param credentialsDto
	 * @param response
	 * @return the user that was deleted
	 */
	@PostMapping("/delete/@{username}/")
	public UserGetDto deleteUser(@PathVariable String username, @RequestBody CredentialsDto credentialsDto, HttpServletResponse response) {
		try {
			UserGetDto deletedUser = userService.deleteUser(username, credentialsDto);
			return deletedUser;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param username
	 * @param credentialsDto
	 * @param response
	 * @return null one both success and failure, as specified
	 */
	@PostMapping("/@{username}/follow/")
	public UserGetDto followUser(@PathVariable String username, @RequestBody CredentialsDto credentialsDto, HttpServletResponse response) {
		try {
			userService.followUser(username, credentialsDto);
			return SUCCESS;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param username
	 * @param credentialsDto
	 * @param response
	 * @return null one both success and failure, as specified
	 */
	@PostMapping("/@{username}/unfollow/")
	public UserGetDto unfollowUser(@PathVariable String username, @RequestBody CredentialsDto credentialsDto, HttpServletResponse response) {
		try {
			userService.unfollowUser(username, credentialsDto);
			return SUCCESS;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR;
		}
	}
	
	/**
	 * @param username
	 * @param response
	 * @return all users who are following the given user
	 */
	@GetMapping("/@{username}/followers/")
	public Set<UserGetDto> getFollowers(@PathVariable String username, HttpServletResponse response) {
		try {
			userService.getUser(username);
			Set<UserGetDto> followers = userService.getFollowers(username);
			return followers;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_USET;
		}
	}
	
	/**
	 * @param username
	 * @param response
	 * @return all users that the given user is following
	 */
	@GetMapping("/@{username}/following/")
	public Set<UserGetDto> getFollowing(@PathVariable String username, HttpServletResponse response) {
		try {
			userService.getUser(username);
			Set<UserGetDto> following = userService.getFollowing(username);
			return following;
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_USET;
		}
	}
	
	/**
	 * @param username
	 * @param response
	 * @return all tweets posted by the user or those their follow
	 */
	@GetMapping("/@{username}/feed/")
	public Set<TweetGetDto> getFeed(@PathVariable String username, HttpServletResponse response) {
		try {
			userService.getUser(username);
			return userService.getFeed(username);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_TSET;
		}
	}
	
	/**
	 * @param username
	 * @param response
	 * @return all of the given user's tweets
	 */
	@GetMapping("/@{username}/tweets/")
	public Set<TweetGetDto> getTweets(@PathVariable String username, HttpServletResponse response) {
		try {
			userService.getUser(username);
			return userService.getTweets(username);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_TSET;
		}
	}
	
	/**
	 * @param username
	 * @param response
	 * @return all tweets in which the given user is mentioned
	 */
	@GetMapping("/@{username}/mentions/")
	public Set<TweetGetDto> getMentions(@PathVariable String username, HttpServletResponse response) {
		try {
			userService.getUser(username);
			return userService.getMentions(username);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_TSET;
		}
	}
	
	/**
	 * @param username
	 * @param response
	 * @return all tweets in which the given user is mentioned
	 */
	@GetMapping("/@{username}/likes/")
	public Set<TweetGetDto> getLikes(@PathVariable String username, HttpServletResponse response) {
		try {
			userService.getUser(username);
			return userService.getLikes(username);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
			return ERROR_TSET;
		}
	}
	
}
