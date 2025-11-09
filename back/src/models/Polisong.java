/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.polisong;

/*import com.polisongstock.model.Comprador;
import com.polisongstock.model.Vendedor;
import com.polisongstock.model.Producto;
import com.polisongstock.model.Recopilacion;*/
import java.util.Scanner;

public class Polisong {
    private static Scanner scanner = new Scanner(System.in);
    
    public static void main(String[] args) {
        System.out.println("=== BIENVENIDO A POLISONG STOCK ===");
        
        // Datos de ejemplo
        Comprador comprador = new Comprador("C001", "Ana García", "ana@email.com", "pass123");
        Vendedor vendedor = new Vendedor("V001", "Tienda Música", "tienda@email.com", "pass456");
        
        // Productos de ejemplo
        Producto Trench_V = new Producto("P001", "Trench", 9.99, "Vinilo");
        Producto Borderline_C = new Producto("P002", "Borderline", 4.99, "Canción");
        
        vendedor.agregarProducto(Trench_V);
        vendedor.agregarProducto(Borderline_C);
        
        int opcion;
        do {
            System.out.println("\n--- MENÚ PRINCIPAL POLISONG ---");
            System.out.println("1. Modo COMPRADOR");
            System.out.println("2. Modo VENDEDOR");
            System.out.println("3. Salir");
            System.out.print("Seleccione una opción: ");
            
            opcion = scanner.nextInt();
            scanner.nextLine();
            
            switch (opcion) {
                case 1:
                    menuComprador(comprador, vendedor);
                    break;
                case 2:
                    menuVendedor(vendedor);
                    break;
                case 3:
                    System.out.println("¡Gracias por usar Polisong Stock!");
                    break;
                default:
                    System.out.println("Opción no válida");
            }
        } while (opcion != 3);
    }
    
    public static void menuComprador(Comprador comprador, Vendedor vendedor) {
        int opcion;
        do {
            System.out.println("\n--- MODO COMPRADOR ---");
            System.out.println("1. Ver productos disponibles");
            System.out.println("2. Agregar producto al carrito");
            System.out.println("3. Ver carrito");
            System.out.println("4. Realizar pedido");
            System.out.println("5. Crear recopilación");
            System.out.println("6. Volver al menú principal");
            System.out.print("Seleccione: ");
            
            opcion = scanner.nextInt();
            scanner.nextLine();
            
            switch (opcion) {
                case 1:
                    System.out.println("\nProductos disponibles:");
                    for (Producto producto : vendedor.getProductosVenta()) {
                        System.out.println("- " + producto.getNombre() + " - $" + producto.getPrecio());
                    }
                    break;
                case 2:
                    System.out.print("Ingrese nombre del producto: ");
                    String nombreProducto = scanner.nextLine();
                    // Lógica para buscar y agregar producto (simplificada)
                    System.out.println("Producto agregado al carrito");
                    break;
                case 3:
                    System.out.println("Carrito: " + comprador.getCarrito().getCantidadItems() + " items");
                    break;
                case 4:
                    comprador.realizarPedido();
                    break;
                case 5:
                    System.out.print("Nombre de la recopilación: ");
                    String nombreRec = scanner.nextLine();
                    comprador.crearRecopilacion(nombreRec);
                    break;
            }
        } while (opcion != 6);
    }
    
    public static void menuVendedor(Vendedor vendedor) {
        int opcion;
        do {
            System.out.println("\n--- MODO VENDEDOR ---");
            System.out.println("1. Agregar producto");
            System.out.println("2. Ver mis productos");
            System.out.println("3. Actualizar stock");
            System.out.println("4. Ver pedidos");
            System.out.println("5. Volver al menú principal");
            System.out.print("Seleccione: ");
            
            opcion = scanner.nextInt();
            scanner.nextLine();
            
            switch (opcion) {
                case 1:
                    System.out.print("Nombre del producto: ");
                    String nombre = scanner.nextLine();
                    System.out.print("Precio: ");
                    double precio = scanner.nextDouble();
                    Producto nuevo = new Producto("P" + System.currentTimeMillis(), nombre, precio);
                    vendedor.agregarProducto(nuevo);
                    break;
                case 2:
                    System.out.println("\nMis productos:");
                    for (Producto producto : vendedor.getProductosVenta()) {
                        System.out.println("- " + producto.getNombre() + " - Stock: " + producto.getStock());
                    }
                    break;
            }
        } while (opcion != 5);
    }
}
