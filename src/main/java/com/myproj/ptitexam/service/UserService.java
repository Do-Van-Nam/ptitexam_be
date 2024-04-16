package com.myproj.ptitexam.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.util.buf.StringCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.myproj.ptitexam.dao.UserDao;
import com.myproj.ptitexam.model.User;

@Service
public class UserService {
    @Autowired
    UserDao userDao;

    public List<User> getAllUser() {
        return userDao.findAll();
    }
    
    public ResponseEntity<String> addUser(User user) {
      try {
        if(userDao.existsByEmail(user.getEmail())) {
            return new ResponseEntity<>("Email exists", HttpStatus.BAD_REQUEST);
        }

        userDao.save(user);
        return new ResponseEntity<>("Add success", HttpStatus.CREATED);
      } catch (Exception e) {
        e.printStackTrace();
      }
      return new ResponseEntity<>("", HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> editUser(Integer userId, User updatedUser) {
      try {
        User existingUser = userDao.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setPassword(updatedUser.getPassword());
        
        userDao.save(existingUser);
        return new ResponseEntity<>("Update successfully", HttpStatus.OK);
      } catch (IllegalArgumentException e) {
          e.printStackTrace();
          return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
      } catch (Exception e) {
          e.printStackTrace();
          return new ResponseEntity<>("Edit failed", HttpStatus.BAD_REQUEST);
      }
    }

    public ResponseEntity<String> deleteUser(Integer userId) {
        try {
          userDao.deleteById(userId);
          return new ResponseEntity<>("Delete successfully", HttpStatus.OK);
        } catch (EmptyResultDataAccessException e) {
          return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
          return new ResponseEntity<>("Delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Object> login(String email, String password) {
    try {
        User user = userDao.findByEmail(email);
        if (user == null || !user.getPassword().equals(password)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        // Creating a map for response data
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("message", "Login successfully");
        responseData.put("userId", user.getId());
        responseData.put("userName", user.getUsername());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    } catch (Exception e) {
        System.out.println(e);
        return new ResponseEntity<>("Login failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    
}
