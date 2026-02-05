package com.api.service;

import org.springframework.stereotype.Service;
import com.api.model.Encuentro;
import com.api.repository.EncuentroRepository;
import java.util.List;

@Service
public class EncuentroService {

    private final EncuentroRepository repo;

    public EncuentroService(EncuentroRepository repo) {
        this.repo = repo;
    }

    public List<Encuentro> getAll() {
        return repo.findAll();
    }
    
    public Encuentro getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Encuentro create(Encuentro encuentro) {
        // Aquí podríamos validar que pk1Id y pk2Id no sean nulos, por ejemplo
        return repo.save(encuentro);
    }

    public Encuentro update(Long id, Encuentro encuentro) {
        encuentro.setId(id);
        return repo.save(encuentro);
    }
    
    public void delete(Long id) {
        repo.deleteById(id);
    }
}