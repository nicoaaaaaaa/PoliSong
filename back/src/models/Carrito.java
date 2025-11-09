/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.polisong;

import java.util.ArrayList;
import java.util.List;

public class Carrito {
    private List<Producto> items;
    
    public Carrito() {
        this.items = new ArrayList<>();
    }
    
    public void agregarItem(Producto producto) {
        items.add(producto);
    }
    
    public void eliminarItem(Producto producto) {
        items.remove(producto);
    }
    
    public double calcularTotal() {
        return items.stream().mapToDouble(Producto::getPrecio).sum();
    }
    
    public List<Producto> getItems() {
        return items;
    }
    
    public int getCantidadItems() {
        return items.size();
    }
    
    public void vaciarCarrito() {
        items.clear();
    }
}