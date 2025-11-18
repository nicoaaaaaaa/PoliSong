class Vendedor extends Usuario {
    constructor(idUsuario, nombreUsuario, email, contraseña) {
        super(idUsuario, nombreUsuario, email, contraseña);

        this.productosVenta = [];   // Lista de productos publicados por el vendedor
        this.pedidosVentas = [];    // Pedidos recibidos
        this.reputacion = 0.0;      // Reputación inicial
        this.metodoPago = "";       // No estaba inicializado en Java
        this.tipoUsuario = "VENDEDOR";
    }
}
