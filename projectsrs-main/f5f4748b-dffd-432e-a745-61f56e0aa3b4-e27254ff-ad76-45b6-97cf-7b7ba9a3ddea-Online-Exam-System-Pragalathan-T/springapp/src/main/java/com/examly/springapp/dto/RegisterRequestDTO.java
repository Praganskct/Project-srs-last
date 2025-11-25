package com.examly.springapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

@NotBlank(message = "Name is required")
private String name;

@Email(message = "Invalid email")
@NotBlank(message = "Email is required")
private String email;

@NotBlank(message = "Username is required")
private String username;

@NotBlank(message = "Password is required")
private String password;

@NotBlank(message = "Role is required")
private String role; // e.g., STUDENT, TEACHER, ADMIN
}
