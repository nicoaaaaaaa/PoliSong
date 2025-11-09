/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.polisong;

import java.util.ArrayList;
import java.util.List;

public class Comprador extends Usuario {
    private Carrito carrito;
    private List<Pedido> pedidos;
    private List<Recopilacion> recopilaciones;
    private List<Valoracion> valoraciones;
    private String direccionEnvio;
    private String metodoPagoPreferido;

    public Comprador(String idUsuario, String nombreUsuario, String email, String contraseña) {
        super(idUsuario, nombreUsuario, email, contraseña);
        this.carrito = new Carrito();
        this.pedidos = new ArrayList<>();
        this.recopilaciones = new ArrayList<>();
        this.valoraciones = new ArrayList<>();
        this.tipoUsuario = "COMPRADOR";
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

    public void realizarPedido() {
        if (carrito.getItems().isEmpty()) {
            System.out.println("El carrito está vacío");
            return;
        }
        
        Pedido nuevoPedido = new Pedido("P" + System.currentTimeMillis(), this.idUsuario);
        for (Producto producto : carrito.getItems()) {
            nuevoPedido.agregarItem(producto);
        }
        nuevoPedido.setTotal(carrito.calcularTotal());
        this.pedidos.add(nuevoPedido);
        carrito.vaciarCarrito();
        System.out.println("Pedido realizado. Total: $" + nuevoPedido.getTotal());
    }

    public void valorarProducto(Producto producto, int puntuacion, String comentario) {
        Valoracion valoracion = new Valoracion(
            "V" + System.currentTimeMillis(),
            producto.getIdProducto(),
            this.idUsuario,
            puntuacion
        );
        valoracion.setComentario(comentario);
        this.valoraciones.add(valoracion);
        System.out.println("Producto valorado: " + producto.getNombre());
    }

    public Recopilacion crearRecopilacion(String nombre) {
        Recopilacion nueva = new Recopilacion(nombre, this.idUsuario);
        this.recopilaciones.add(nueva);
        return nueva;
    }

    // Getters específicos
    public Carrito getCarrito() { return carrito; }
    public List<Pedido> getPedidos() { return pedidos; }
    public List<Recopilacion> getRecopilaciones() { return recopilaciones; }
    public String getDireccionEnvio() { return direccionEnvio; }
    public void setDireccionEnvio(String direccionEnvio) { this.direccionEnvio = direccionEnvio; }
}
