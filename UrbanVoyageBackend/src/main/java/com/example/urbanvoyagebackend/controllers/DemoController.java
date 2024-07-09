package com.example.urbanvoyagebackend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class DemoController {

    @GetMapping("hello")
    public String hello() {
        return "Hello, Spring Boot with PostgreSQL!";
    }
}
