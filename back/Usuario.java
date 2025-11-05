/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.polisong;

public abstract class Usuario {
    protected String idUsuario;
    protected String nombreUsuario;
    protected String email;
    protected String contraseña;
    protected String tipoUsuario;
    
    public Usuario(String idUsuario, String nombreUsuario, String email, String contraseña) {
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.contraseña = contraseña;
    }
    
    public abstract String registrar();
    public abstract String iniciarSesion();
    
    public String getIdUsuario() { return idUsuario; }
    public String getNombreUsuario() { return nombreUsuario; }
    public String getEmail() { return email; }
    public String getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }
}