/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.polisong;

import java.util.ArrayList;
import java.util.List;

public class Vendedor extends Usuario {
    private List<Producto> productosVenta;
    private List<Pedido> pedidosVentas;
    private double reputacion;
    private String metodoPago;
    
    public Vendedor(String idUsuario, String nombreUsuario, String email, String contraseña) {
        super(idUsuario, nombreUsuario, email, contraseña);
        this.productosVenta = new ArrayList<>();
        this.pedidosVentas = new ArrayList<>();
        this.reputacion = 0.0;
    }
    
    @Override
    public String registrar() {
        String mensaje = "Usuario registrado exitosamente: " + this.nombreUsuario + 
                        " - ID: " + this.idUsuario + 
                        " - Tipo: " + this.tipoUsuario;
        System.out.println(mensaje);
        return mensaje;
    }
    
    @Override
    public String iniciarSesion() {
        String mensaje = "Sesión iniciada como Vendedor: " + this.nombreUsuario + 
                        " - Email: " + this.email + " - Contraseña" + this.contraseña;
        System.out.println(mensaje);
        return mensaje;
    }
    
    public void agregarProducto(Producto producto) {
        this.productosVenta.add(producto);
        System.out.println("Producto agregado: " + producto.getNombre());
    }
    
    public void actualizarInventario(String idProducto, int nuevoStock) {
        for (Producto producto : productosVenta) {
            if (producto.getIdProducto().equals(idProducto)) {
                producto.setStock(nuevoStock);
                System.out.println("Stock actualizado para: " + producto.getNombre());
                return;
            }
        }
    }
    
    // Getters
    public List<Producto> getProductosVenta() { return productosVenta; }
    public List<Pedido> getPedidosVentas() { return pedidosVentas; }
    public double getReputacion() { return reputacion; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
}
