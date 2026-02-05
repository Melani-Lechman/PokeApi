package com.api.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.api.model.Equipo;
import com.api.repository.EquipoRepository; 

@RestController
@RequestMapping("/api/equipos")
@CrossOrigin(origins = "*")
public class EquipoController {

    private final EquipoRepository repo;

    public EquipoController(EquipoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Equipo> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Equipo getById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping
    public Equipo create(@RequestBody Equipo equipo) {
        return repo.save(equipo);
    }

    @PutMapping("/{id}")
    public Equipo update(@PathVariable Long id, @RequestBody Equipo equipo) {
        equipo.setId(id);
        return repo.save(equipo);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}