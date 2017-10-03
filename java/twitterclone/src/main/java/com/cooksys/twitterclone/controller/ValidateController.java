/**
 * 
 */
package com.cooksys.twitterclone.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.twitterclone.dto.CredentialsDto;
import com.cooksys.twitterclone.exception.TwitterException;
import com.cooksys.twitterclone.service.ValidateService;

/**
 * @author Greg Hill
 *
 */
@RestController
@RequestMapping("/validate/")
@CrossOrigin(origins = "http://localhost:8080")
public class ValidateController {
	
	private ValidateService validateService;

	/**
	 * Constructor injecting services
	 * @param validateService
	 */
	public ValidateController(ValidateService validateService) {
		this.validateService = validateService;
	}
	
	/**
	 * @param credentials
	 * @param response
	 */
	@PostMapping("/login/")
	public void login(@RequestBody CredentialsDto credentials, HttpServletResponse response) {
		try {
			validateService.login(credentials);
		} catch (TwitterException twitterException) {
			response.setStatus(twitterException.getResponse());
		}
	}
	
	/**
	 * @param label
	 * @return boolean value representing whether or not the tag exists in the database
	 */
	@GetMapping("/tag/exists/{label}/")
	public Boolean getTagExists(@PathVariable String label) {
		return validateService.getTagExists(label);
	}
	
	/**
	 * @param username
	 * @return boolean value representing whether or not the username is avaliable
	 */
	@GetMapping("/username/available/@{username}/")
	public Boolean getUsernameAvailable(@PathVariable String username) {
		return validateService.getUsernameAvailable(username);
	}
	
	/**
	 * @param username
	 * @return boolean value representing whether or not the tag exists in the database and is active
	 */
	@GetMapping("/username/exists/@{username}/")
	public Boolean getUsernameExists(@PathVariable String username) {
		return validateService.getUsernameExists(username);
	}
	
}
