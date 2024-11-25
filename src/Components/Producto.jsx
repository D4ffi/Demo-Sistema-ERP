import React, { useState, useEffect } from "react";
import { Package, Plus, Edit2, Trash2, Save, X } from "lucide-react";

const Producto = ({ updateProductCount, updateProducts }) => {
    const [products, setProducts] = useState([]);
    const [nombre, setNombre] = useState("");
    const [stock, setStock] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [nextId, setNextId] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Estados para edición
    const [editNombre, setEditNombre] = useState("");
    const [editStock, setEditStock] = useState("");
    const [editPrecio, setEditPrecio] = useState("");
    const [editCategoria, setEditCategoria] = useState("");

    // Categorías disponibles
    const categorias = [
        "Electrónicos",
        "Ropa",
        "Alimentos",
        "Hogar",
        "Deportes",
        "Otros"
    ];

    useEffect(() => {
        updateProductCount(products.length);
        updateProducts(products);
    }, [products, updateProductCount, updateProducts]);

    const validateInputs = () => {
        return (
            nombre.trim() !== "" &&
            !isNaN(stock) &&
            parseInt(stock) >= 0 &&
            !isNaN(precio) &&
            parseFloat(precio) >= 0 &&
            categoria !== ""
        );
    };

    const addProduct = (e) => {
        e.preventDefault();
        if (validateInputs()) {
            const newProduct = {
                id: nextId,
                nombre: nombre.trim(),
                stock: parseInt(stock),
                precio: parseFloat(precio),
                categoria,
                fechaCreacion: new Date().toLocaleDateString()
            };
            setProducts([...products, newProduct]);
            resetForm();
            setNextId(nextId + 1);
        }
    };

    const resetForm = () => {
        setNombre("");
        setStock("");
        setPrecio("");
        setCategoria("");
    };

    const startEditing = (product) => {
        setEditingId(product.id);
        setEditNombre(product.nombre);
        setEditStock(product.stock.toString());
        setEditPrecio(product.precio.toString());
        setEditCategoria(product.categoria);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditNombre("");
        setEditStock("");
        setEditPrecio("");
        setEditCategoria("");
    };

    const saveEdit = (id) => {
        if (
            editNombre.trim() !== "" &&
            !isNaN(editStock) &&
            !isNaN(editPrecio) &&
            editCategoria !== ""
        ) {
            setProducts(
                products.map((product) =>
                    product.id === id
                        ? {
                            ...product,
                            nombre: editNombre.trim(),
                            stock: parseInt(editStock),
                            precio: parseFloat(editPrecio),
                            categoria: editCategoria
                        }
                        : product
                )
            );
            setEditingId(null);
        }
    };

    const deleteProduct = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            setProducts(products.filter((product) => product.id !== id));
        }
    };

    const filteredProducts = products.filter((product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
            </div>

            {/* Formulario de Producto */}
            <form onSubmit={addProduct} className="mb-8 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Nombre del Producto"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                    />
                    <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Seleccionar Categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={!validateInputs()}
                        className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-5 h-5 mr-1" />
                        Agregar Producto
                    </button>
                </div>
            </form>

            {/* Barra de búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Tabla de Productos */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editingId === product.id ? (
                                    <input
                                        type="text"
                                        value={editNombre}
                                        onChange={(e) => setEditNombre(e.target.value)}
                                        className="w-full p-1 border rounded"
                                    />
                                ) : (
                                    product.nombre
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editingId === product.id ? (
                                    <input
                                        type="number"
                                        value={editStock}
                                        onChange={(e) => setEditStock(e.target.value)}
                                        className="w-full p-1 border rounded"
                                        min="0"
                                    />
                                ) : (
                                    product.stock
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editingId === product.id ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editPrecio}
                                        onChange={(e) => setEditPrecio(e.target.value)}
                                        className="w-full p-1 border rounded"
                                        min="0"
                                    />
                                ) : (
                                    `$${product.precio}`
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editingId === product.id ? (
                                    <select
                                        value={editCategoria}
                                        onChange={(e) => setEditCategoria(e.target.value)}
                                        className="w-full p-1 border rounded"
                                    >
                                        {categorias.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    product.categoria
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.fechaCreacion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {editingId === product.id ? (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => saveEdit(product.id)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <Save className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => startEditing(product)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Producto;