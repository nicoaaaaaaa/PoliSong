class Pedido {
    constructor(idPedido, idComprador) {
        this.idPedido = idPedido;
        this.idComprador = idComprador;
        this.fechaPedido = new Date();
        this.estado = "Pendiente";
        this.items = [];  // Lista de items (pueden ser objetos)
        this.total = 0.0;
    }
}
