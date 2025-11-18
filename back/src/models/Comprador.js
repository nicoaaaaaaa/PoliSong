class Comprador extends Usuario {
    constructor(idUsuario, nombreUsuario, email, contraseña) {
        super(idUsuario, nombreUsuario, email, contraseña);
        
        this.carrito = new Carrito();
        this.pedidos = [];
        this.recopilaciones = [];
        this.valoraciones = [];
        this.direccionEnvio = "";
        this.metodoPagoPreferido = "";
        this.tipoUsuario = "COMPRADOR";
    }
}
