package com.api.model;

import jakarta.persistence.*;

@Entity
public class Equipo {

    // --- ESTAS ANOTACIONES SON CRUCIALES ---
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ----------------------------------------
    private Long id;

    private String nombre;
    private Long entrenadorId; 
    public Equipo() {}

    // --- Getters y Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Long getEntrenadorId() { return entrenadorId; }
    public void setEntrenadorId(Long entrenadorId) { this.entrenadorId = entrenadorId; }
}