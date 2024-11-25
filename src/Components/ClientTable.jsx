import React, { useState, useEffect } from "react";

const ClientTable = ({ updateClientCount, updateClients }) => {
    const [clients, setClients] = useState([]);
    const [name, setName] = useState("");
    const [nextId, setNextId] = useState(1);

    useEffect(() => {
        updateClientCount(clients.length);
        updateClients(clients);
    }, [clients, updateClientCount, updateClients]);

    const addClient = (e) => {
        e.preventDefault();
        if (name.trim()) {
            const newClient = { id: nextId, name: name.trim() };
            setClients([...clients, newClient]);
            setName("");
            setNextId(nextId + 1);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Clientes</h2>
            <form onSubmit={addClient} className="mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Nombre del Cliente"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Agregar Cliente
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{client.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{client.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientTable;