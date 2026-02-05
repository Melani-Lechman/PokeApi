package com.api.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.api.model.Entrenador;
import com.api.repository.EntrenadorRepository; 

@RestController
@RequestMapping("/api/entrenadores")
@CrossOrigin(origins = "*")
public class EntrenadorController {

    private final EntrenadorRepository repo;

    public EntrenadorController(EntrenadorRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Entrenador> getAll() {
        return repo.findAll();
    }
    
    @GetMapping("/{id}")
    public Entrenador getById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping
    public Entrenador create(@RequestBody Entrenador e) {
        return repo.save(e);
    }

    @PutMapping("/{id}")
    public Entrenador update(@PathVariable Long id, @RequestBody Entrenador entrenador) {
        entrenador.setId(id);
        return repo.save(entrenador);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}