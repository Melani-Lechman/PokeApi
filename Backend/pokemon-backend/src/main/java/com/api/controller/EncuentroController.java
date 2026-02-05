package com.api.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.api.model.Encuentro;
import com.api.repository.EncuentroRepository; 

@RestController
@RequestMapping("/api/encuentros")
@CrossOrigin(origins = "*")
public class EncuentroController {

    private final EncuentroRepository repo;

    public EncuentroController(EncuentroRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Encuentro> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Encuentro getById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping
    public Encuentro create(@RequestBody Encuentro e) {
        return repo.save(e);
    }

    @PutMapping("/{id}")
    public Encuentro update(@PathVariable Long id, @RequestBody Encuentro encuentro) {
    	encuentro.setId(id);
        return repo.save(encuentro);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}