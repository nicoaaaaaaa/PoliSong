class Carrito {
    constructor() {
        this.items = [];
    }

    agregarItem(producto) {
        this.items.push(producto);
    }

    eliminarItem(producto) {
        // Elimina solo la primera coincidencia
        const index = this.items.indexOf(producto);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    calcularTotal() {
        return this.items.reduce((total, producto) => total + producto.precio, 0);
    }

    getItems() {
        return this.items;
    }

    getCantidadItems() {
        return this.items.length;
    }

    vaciarCarrito() {
        this.items = [];
    }
}
