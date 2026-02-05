package com.api.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.api.model.Pokemon;
import com.api.repository.PokemonRepository; 

@RestController
@RequestMapping("/api/pokemon")
@CrossOrigin(origins = "*")
public class PokemonController {

    private final PokemonRepository repo;

    public PokemonController(PokemonRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Pokemon> getAll() {
        return repo.findAll();
    }
    
    @GetMapping("/{id}")
    public Pokemon getById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping
    public Pokemon create(@RequestBody Pokemon p) {
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public Pokemon update(@PathVariable Long id, @RequestBody Pokemon pokemon) {
        pokemon.setId(id);
        return repo.save(pokemon);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}