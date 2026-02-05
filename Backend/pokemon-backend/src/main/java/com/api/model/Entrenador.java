package com.api.model;

import jakarta.persistence.*;

@Entity
public class Entrenador {

    // --- ESTAS ANOTACIONES SON CRUCIALES ---
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ----------------------------------------
    private Long id;
    
    private String nombre;
    private String ciudad;

    // Constructor vacío (necesario para JPA)
    public Entrenador() {}

    // --- Getters y Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
}