package com.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Encuentro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // --- CAMBIOS ---
    private Long pokemon1Id; // ID del primer Pokémon
    private Long pokemon2Id; // ID del segundo Pokémon
    private Long ganadorId;  // ID del Pokémon que ganó
    
    private LocalDate fecha;

    public Encuentro() {}

    // --- Getters y Setters actualizados ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getPokemon1Id() { return pokemon1Id; }
    public void setPokemon1Id(Long pokemon1Id) { this.pokemon1Id = pokemon1Id; }
    
    public Long getPokemon2Id() { return pokemon2Id; }
    public void setPokemon2Id(Long pokemon2Id) { this.pokemon2Id = pokemon2Id; }
    
    public Long getGanadorId() { return ganadorId; }
    public void setGanadorId(Long ganadorId) { this.ganadorId = ganadorId; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}