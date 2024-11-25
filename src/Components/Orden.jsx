import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Package, User } from 'lucide-react';

const Orden = ({
                   updateTotalVentas,
                   updateOrdenesRealizadas,
                   clients,
                   products,
                   updateProducts
               }) => {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState({
        cliente: '',
        productos: [],
        total: 0
    });
    const [selectedProducto, setSelectedProducto] = useState({
        id: '',
        cantidad: 1
    });

    const calcularSubtotal = (precio, cantidad) => {
        return precio * cantidad;
    };

    const agregarProducto = () => {
        if (selectedProducto.id && selectedProducto.cantidad > 0) {
            const producto = products.find(p => p.id === parseInt(selectedProducto.id));

            // Verificar si hay suficiente stock
            if (!producto || selectedProducto.cantidad > producto.stock) {
                alert('No hay suficiente stock disponible');
                return;
            }

            const subtotal = calcularSubtotal(producto.precio, selectedProducto.cantidad);

            // Verificar si el producto ya está en la orden
            const existingProductIndex = currentOrder.productos.findIndex(
                p => p.id === parseInt(selectedProducto.id)
            );

            if (existingProductIndex !== -1) {
                // Actualizar cantidad si el producto ya está en la orden
                const nuevaCantidad = currentOrder.productos[existingProductIndex].cantidad + selectedProducto.cantidad;

                if (nuevaCantidad > producto.stock) {
                    alert('No hay suficiente stock disponible');
                    return;
                }

                const nuevosProductos = [...currentOrder.productos];
                nuevosProductos[existingProductIndex] = {
                    ...nuevosProductos[existingProductIndex],
                    cantidad: nuevaCantidad,
                    subtotal: calcularSubtotal(producto.precio, nuevaCantidad)
                };

                setCurrentOrder(prev => ({
                    ...prev,
                    productos: nuevosProductos,
                    total: nuevosProductos.reduce((sum, p) => sum + p.subtotal, 0)
                }));
            } else {
                // Agregar nuevo producto a la orden
                const nuevoProducto = {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: selectedProducto.cantidad,
                    subtotal: subtotal
                };

                setCurrentOrder(prev => ({
                    ...prev,
                    productos: [...prev.productos, nuevoProducto],
                    total: prev.total + subtotal
                }));
            }

            // Resetear selección
            setSelectedProducto({
                id: '',
                cantidad: 1
            });
        }
    };

    const eliminarProducto = (index) => {
        setCurrentOrder(prev => {
            const nuevosProductos = [...prev.productos];
            const subtotalEliminado = nuevosProductos[index].subtotal;
            nuevosProductos.splice(index, 1);

            return {
                ...prev,
                productos: nuevosProductos,
                total: prev.total - subtotalEliminado
            };
        });
    };

    const actualizarStock = () => {
        const productosActualizados = products.map(producto => {
            const productoEnOrden = currentOrder.productos.find(p => p.id === producto.id);
            if (productoEnOrden) {
                return {
                    ...producto,
                    stock: producto.stock - productoEnOrden.cantidad
                };
            }
            return producto;
        });
        updateProducts(productosActualizados);
    };

    const procesarOrden = () => {
        if (currentOrder.cliente && currentOrder.productos.length > 0) {
            // Verificar stock final
            const stockSuficiente = currentOrder.productos.every(producto => {
                const productoOriginal = products.find(p => p.id === producto.id);
                return productoOriginal && productoOriginal.stock >= producto.cantidad;
            });

            if (!stockSuficiente) {
                alert('No hay suficiente stock para completar la orden');
                return;
            }

            const nuevaOrden = {
                ...currentOrder,
                id: orders.length + 1,
                fecha: new Date().toLocaleDateString(),
                nombreCliente: clients.find(c => c.id === parseInt(currentOrder.cliente))?.name
            };

            setOrders(prev => [...prev, nuevaOrden]);

            // Actualizar contadores globales
            updateTotalVentas(prev => prev + currentOrder.total);
            updateOrdenesRealizadas(prev => prev + 1);

            // Actualizar stock de productos
            actualizarStock();

            // Resetear orden actual
            setCurrentOrder({
                cliente: '',
                productos: [],
                total: 0
            });
        }
    };

    const productosDisponibles = products.filter(p => p.stock > 0);

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
            <div className="flex items-center mb-6">
                <ShoppingCart className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Nueva Orden</h2>
            </div>

            {/* Formulario de Orden */}
            <div className="space-y-6">
                {/* Selección de Cliente */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cliente
                    </label>
                    <div className="flex gap-2 items-center">
                        <User className="w-5 h-5 text-gray-400" />
                        <select
                            value={currentOrder.cliente}
                            onChange={(e) => setCurrentOrder(prev => ({...prev, cliente: e.target.value}))}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar Cliente</option>
                            {clients.map(cliente => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Agregar Productos */}
                <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Agregar Productos</h3>
                    <div className="flex gap-4">
                        <div className="flex gap-2 items-center flex-1">
                            <Package className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedProducto.id}
                                onChange={(e) => setSelectedProducto(prev => ({...prev, id: e.target.value}))}
                                className="flex-1 p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Seleccionar Producto</option>
                                {productosDisponibles.map(producto => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre} - Stock: {producto.stock} - ${producto.precio}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="number"
                            min="1"
                            value={selectedProducto.cantidad}
                            onChange={(e) => setSelectedProducto(prev => ({
                                ...prev,
                                cantidad: parseInt(e.target.value) || 1
                            }))}
                            className="w-24 p-2 border border-gray-300 rounded-md"
                        />
                        <button
                            onClick={agregarProducto}
                            disabled={!selectedProducto.id || selectedProducto.cantidad < 1}
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center disabled:bg-gray-300"
                        >
                            <Plus className="w-5 h-5 mr-1" />
                            Agregar
                        </button>
                    </div>
                </div>

                {/* Lista de Productos en la Orden */}
                {currentOrder.productos.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Productos en la Orden</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                    <th className="text-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                    <th className="text-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                                    <th className="text-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {currentOrder.productos.map((producto, index) => (
                                    <tr key={index}>
                                        <td className="text-gray-700 px-4 py-2">{producto.nombre}</td>
                                        <td className="text-gray-700 px-4 py-2">{producto.cantidad}</td>
                                        <td className="text-gray-700 px-4 py-2">${producto.precio}</td>
                                        <td className="text-gray-700 px-4 py-2">${producto.subtotal}</td>
                                        <td className="text-gray-700 px-4 py-2">
                                            <button
                                                onClick={() => eliminarProducto(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50">
                                    <td colSpan="3" className="px-4 py-2 text-right font-medium">Total:</td>
                                    <td className="px-4 py-2 font-bold">${currentOrder.total}</td>
                                    <td></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Botón Procesar Orden */}
                <button
                    onClick={procesarOrden}
                    disabled={!currentOrder.cliente || currentOrder.productos.length === 0}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Procesar Orden
                </button>
            </div>

            {/* Historial de Órdenes */}
            {orders.length > 0 && (
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Historial de Órdenes</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {orders.map(orden => (
                                <tr key={orden.id} className="hover:bg-gray-50">
                                    <td className="text-gray-700 px-4 py-2">{orden.id}</td>
                                    <td className="text-gray-700 px-4 py-2">{orden.nombreCliente}</td>
                                    <td className="text-gray-700 px-4 py-2">{orden.fecha}</td>
                                    <td className="text-gray-700 px-4 py-2">${orden.total}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orden;