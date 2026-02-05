package com.api.service;

import org.springframework.stereotype.Service;
import com.api.model.Pokemon;
import com.api.repository.PokemonRepository;
import java.util.List;

@Service
public class PokemonService {

    private final PokemonRepository repo;

    public PokemonService(PokemonRepository repo) {
        this.repo = repo;
    }

    public List<Pokemon> getAll() {
        return repo.findAll();
    }
    
    public Pokemon getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Pokemon create(Pokemon pokemon) {
        return repo.save(pokemon);
    }

    public Pokemon update(Long id, Pokemon pokemon) {
        pokemon.setId(id);
        return repo.save(pokemon);
    }
    
    public void delete(Long id) {
        repo.deleteById(id);
    }
    
}