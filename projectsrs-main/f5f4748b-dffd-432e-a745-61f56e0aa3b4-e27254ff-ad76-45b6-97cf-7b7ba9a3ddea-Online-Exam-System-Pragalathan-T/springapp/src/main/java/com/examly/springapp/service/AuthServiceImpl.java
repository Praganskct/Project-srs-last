package com.examly.springapp.service;

import com.examly.springapp.dto.AuthRequestDTO;
import com.examly.springapp.dto.AuthResponseDTO;
import com.examly.springapp.dto.RegisterRequestDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Optional;



@Service
public class AuthServiceImpl implements AuthService, UserDetailsService {

private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;

@Lazy
@Autowired
private  AuthenticationManager authenticationManager;

public AuthServiceImpl(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
this.userRepository = userRepository;
this.passwordEncoder = passwordEncoder;
//this.authenticationManager=authenticationManager;
}

@Override
public AuthResponseDTO login(AuthRequestDTO request) {
          Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

if (userOpt.isEmpty()) {
 throw new RuntimeException("Invalid username or password");
 }

 User user = userOpt.get();
  System.out.println("Login attempt for user: " + user.getUsername());
  System.out.println("Stored hashed password: " + user.getPassword());
  System.out.println("Password matches: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));

 if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
         throw new RuntimeException("Invalid username or password");
 }

SecurityContextHolder.getContext().setAuthentication(authentication);

 String token = "dummy-token-for-" + user.getUsername();

//return new AuthResponseDTO(token, user.getUsername(), user.getRole());

 return new AuthResponseDTO("dummy-token", request.getUsername(), "STUDENT");
}

@Override
public void register(RegisterRequestDTO request) {
if (userRepository.existsByUsername(request.getUsername())) {
throw new RuntimeException("Username already exists");
}


if (userRepository.existsByEmail(request.getEmail())) {
throw new RuntimeException("Email already exists");
}

User newUser;


switch (request.getRole().toUpperCase()) {
case "STUDENT":
newUser = new com.examly.springapp.model.Student();
break;
case "TEACHER":
newUser = new com.examly.springapp.model.Teacher();
break;
case "ADMIN":
newUser = new com.examly.springapp.model.Admin();
break;
default:
throw new RuntimeException("Invalid role");
}

newUser.setName(request.getName());
newUser.setEmail(request.getEmail());
newUser.setUsername(request.getUsername());


newUser.setPassword(passwordEncoder.encode(request.getPassword()));
newUser.setRole(request.getRole().toUpperCase());



userRepository.save(newUser);
}

@Override
public void logout() {


}

@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
com.examly.springapp.model.User user = userRepository.findByUsername(username)
.orElseThrow(() -> new UsernameNotFoundException("User not found"));

return org.springframework.security.core.userdetails.User
.withUsername(user.getUsername())
.password(user.getPassword())
.roles(user.getRole()) // this expects role without prefix "ROLE_"
.build();
}
}
