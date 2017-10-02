/**
 * 
 */
package com.cooksys.twitterclone.exception;

import javax.servlet.http.HttpServletResponse;

/**
 * @author Greg Hill
 *
 */
public class TwitterException extends Exception {

	private Integer errorResponse;
	
	/**
	 * Default Constructor
	 */
	public TwitterException(ErrorType errorType) {
		switch(errorType) {
			case NOT_FOUND:
				errorResponse = HttpServletResponse.SC_NOT_FOUND;
				break;
			case NOT_MODIFIED:
				errorResponse = HttpServletResponse.SC_NOT_MODIFIED;
				break;
			case NOT_ACCEPTABLE:
				errorResponse = HttpServletResponse.SC_NOT_ACCEPTABLE;
				break;
			case NOT_AUTHORIZED:
				errorResponse = HttpServletResponse.SC_UNAUTHORIZED;
				break;
			case CONFLICT:
				errorResponse = HttpServletResponse.SC_CONFLICT;
				break;
			default:
				errorResponse = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
				break;
		}
	}
	
	public Integer getResponse() {
		return errorResponse;
	}

}
