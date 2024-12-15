import React, { useEffect, useState } from "react";
//import Link from "next/link";
import ClientCard from "../../components/ClientCard";
import { getClients } from "../../utils/firebase";
import { useRouter } from "next/router";


const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // מחרוזת החיפוש
    const [filteredClients, setFilteredClients] = useState([]); // לקוחות מסוננים
    const router = useRouter();
    
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients();
                const clientsArray = data ? Object.entries(data) : [];
                setClients(clientsArray);
                setFilteredClients(clientsArray); // ברירת מחדל - הצגת כל הלקוחות
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };
        fetchClients();
    }, []);

    // סינון לפי מחרוזת חיפוש
    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = clients.filter(([, client]) =>
            client.name?.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredClients(filtered);
    }, [searchTerm, clients]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">לקוחות</h1>

            {/* סרגל חיפוש */}
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="חפש לקוח..."
                    className="w-1/3 border border-gray-300 rounded px-3 py-2 text-right"
                />
               <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => router.push("/clients/new")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
                    style={{ width: "60px", height: "60px" }}
                >
                    +
                </button>
            </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredClients.map(([id, client]) => (
                    <ClientCard key={id} id={id} client={client} />
                ))}
            </div>
        </div>
    );
};

export default ClientsPage;
