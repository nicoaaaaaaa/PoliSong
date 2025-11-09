/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.polisong;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;

public class Pedido {
    private String idPedido;
    private String idComprador;
    private Date fechaPedido;
    private String estado;
    private double total;
    private List<Object> items; 
    
    public Pedido(String idPedido, String idComprador) {
        this.idPedido = idPedido;
        this.idComprador = idComprador;
        this.fechaPedido = new Date();
        this.estado = "Pendiente";
        this.items = new ArrayList<>();
        this.total = 0.0;
    }
    
    public String getIdPedido() { return idPedido; }
    public String getIdComprador() { return idComprador; }
    public Date getFechaPedido() { return fechaPedido; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public List<Object> getItems() { return items; }
    
    public void agregarItem(Object item) {
        this.items.add(item);
    }
}