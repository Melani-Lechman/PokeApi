package com.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.api.model.Equipo;
public interface EquipoRepository extends JpaRepository<Equipo, Long> {}
