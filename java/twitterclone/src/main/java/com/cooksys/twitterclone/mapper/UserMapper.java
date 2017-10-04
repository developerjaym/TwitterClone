/**
 * 
 */
package com.cooksys.twitterclone.mapper;

import java.sql.Timestamp;
import java.util.TreeSet;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.cooksys.twitterclone.dto.UserGetDto;
import com.cooksys.twitterclone.dto.UserSaveDto;
import com.cooksys.twitterclone.entity.UserEntity;

/**
 * @author Greg Hill
 *
 */
@Mapper(componentModel="spring", uses={ ProfileMapper.class, CredentialsMapper.class, HashtagMapper.class })
public interface UserMapper {

	@Mapping(source = "credentials.username", target = "username")
	UserGetDto toDtoGet(UserEntity userEntity);
	
	UserEntity fromDtoSave(UserSaveDto userSaveDto);
	
	TreeSet<UserGetDto> toDto(TreeSet<UserEntity> users);
	
}
