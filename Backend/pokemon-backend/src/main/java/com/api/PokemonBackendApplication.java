package com.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PokemonBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PokemonBackendApplication.class, args);
        System.out.println("✅ Servidor Spring Boot iniciado en http://localhost:8080");
    }
}