package com.examly.springapp.config;

import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public SimpleModule customDeserializerModule() {
        SimpleModule module = new SimpleModule();
        module.addDeserializer(String.class, new StringSanitizer());
        return module;
    }
}