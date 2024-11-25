import React, { useState } from "react";
import { CircleDollarSign, Clipboard, Package, TruckIcon, User } from "lucide-react";
import ClientTable from "./ClientTable.jsx";
import Producto from "./Producto.jsx";
import Orden from "./Orden.jsx";

export const Dashboard = () => {
    const [clientCount, setClientCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [ordenesRealizadas, setOrdenesRealizadas] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);

    const updateClientCount = (count) => {
        setClientCount(count);
    };

    const updateProductCount = (count) => {
        setProductCount(count);
    };

    // Función para actualizar la lista de clientes
    const updateClients = (newClients) => {
        setClients(newClients);
    };

    // Función para actualizar la lista de productos
    const updateProducts = (newProducts) => {
        setProducts(newProducts);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">ERP Demo</h1>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Card Clientes */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <User className="text-blue-600 w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold text-gray-800">Clientes</h2>
                                <p className="text-2xl font-bold text-blue-600">{clientCount}</p>
                            </div>
                        </div>
                        <p className="text-gray-600">Total de clientes registrados</p>
                    </div>

                    {/* Card Productos */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Package className="text-green-600 w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold text-gray-800">Productos</h2>
                                <p className="text-2xl font-bold text-green-600">{productCount}</p>
                            </div>
                        </div>
                        <p className="text-gray-600">Total de productos en catálogo</p>
                    </div>

                    {/* Card Ventas */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <CircleDollarSign className="text-purple-600 w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold text-gray-800">Ventas</h2>
                                <p className="text-2xl font-bold text-purple-600">${totalVentas.toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="text-gray-600">Total de ventas realizadas</p>
                    </div>

                    {/* Card Órdenes */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Clipboard className="text-yellow-600 w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold text-gray-800">Órdenes</h2>
                                <p className="text-2xl font-bold text-yellow-600">{ordenesRealizadas}</p>
                            </div>
                        </div>
                        <p className="text-gray-600">Total de órdenes procesadas</p>
                    </div>

                    {/* Card Proveedores */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <TruckIcon className="text-red-600 w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold text-gray-800">Proveedores</h2>
                                <p className="text-2xl font-bold text-red-600">0</p>
                            </div>
                        </div>
                        <p className="text-gray-600">Total de proveedores activos</p>
                    </div>
                </div>

                {/* Componentes principales */}
                <div className="space-y-8">
                    {/* Tabla de Clientes */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <ClientTable
                            updateClientCount={updateClientCount}
                            updateClients={updateClients}
                        />
                    </div>

                    {/* Tabla de Productos */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <Producto
                            updateProductCount={updateProductCount}
                            updateProducts={updateProducts}
                        />
                    </div>

                    {/* Sistema de Órdenes */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <Orden
                            updateTotalVentas={setTotalVentas}
                            updateOrdenesRealizadas={setOrdenesRealizadas}
                            clients={clients}
                            products={products}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;