/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.polisong;

import java.util.Date;

public class Valoracion {
    private String idValoracion;
    private String idProducto;
    private String idComprador;
    private int puntuacion;
    private String comentario;
    private Date fecha;
    
    public Valoracion(String idValoracion, String idProducto, String idComprador, int puntuacion) {
        this.idValoracion = idValoracion;
        this.idProducto = idProducto;
        this.idComprador = idComprador;
        this.puntuacion = puntuacion;
        this.fecha = new Date();
    }
    
    public String getIdValoracion() { return idValoracion; }
    public String getIdProducto() { return idProducto; }
    public String getIdComprador() { return idComprador; }
    public int getPuntuacion() { return puntuacion; }
    public void setPuntuacion(int puntuacion) { this.puntuacion = puntuacion; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public Date getFecha() { return fecha; }
}
