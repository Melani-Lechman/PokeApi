package com.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.api.model.Pokemon;
public interface PokemonRepository extends JpaRepository<Pokemon, Long> {}
