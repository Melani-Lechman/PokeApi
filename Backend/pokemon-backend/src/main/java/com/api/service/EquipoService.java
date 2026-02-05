package com.api.service;

import org.springframework.stereotype.Service;
import com.api.model.Equipo;
import com.api.repository.EquipoRepository;
import java.util.List;

@Service
public class EquipoService {

    private final EquipoRepository repo;

    public EquipoService(EquipoRepository repo) {
        this.repo = repo;
    }

    public List<Equipo> getAll() {
        return repo.findAll();
    }
    
    public Equipo getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Equipo create(Equipo equipo) {
        return repo.save(equipo);
    }

    public Equipo update(Long id, Equipo equipo) {
        equipo.setId(id);
        return repo.save(equipo);
    }
    
    public void delete(Long id) {
        repo.deleteById(id);
    }
}