package com.api.service;

import org.springframework.stereotype.Service;
import com.api.model.Entrenador;
import com.api.repository.EntrenadorRepository; // Asegúrate que el paquete sea el correcto
import java.util.List;

@Service // 1. Marcamos esta clase como un "Servicio"
public class EntrenadorService {

    // 2. Inyectamos el Repositorio (el Gerente de Almacén)
    private final EntrenadorRepository repo;

    public EntrenadorService(EntrenadorRepository repo) {
        this.repo = repo;
    }

    // 3. Movemos toda la lógica del Controlador para aquí
    
    public List<Entrenador> getAll() {
        return repo.findAll();
    }
    
    public Entrenador getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Entrenador create(Entrenador entrenador) {
        // Aquí se podrían agregar lógicas extra (ej: validar que el nombre no exista)
        return repo.save(entrenador);
    }

    public Entrenador update(Long id, Entrenador entrenador) {
        // Esta es la lógica de "editar" que nos costó tanto
        entrenador.setId(id); 
        return repo.save(entrenador);
    }
    
    public void delete(Long id) {
        repo.deleteById(id);
    }
}