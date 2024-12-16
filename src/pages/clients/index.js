import React, { useEffect, useState } from "react";
import ClientCard from "../../components/ClientCard"; // יבוא של רכיב ה-ClientCard
import { getClients, deleteClient } from "../../utils/firebase"; // הפונקציות מה-DB
import { useRouter } from "next/router";
import { Trash2 } from "lucide-react";

const ClientsPage = () => {
    const [clients, setClients] = useState([]); // רשימת הלקוחות
    const [searchTerm, setSearchTerm] = useState(""); // מחרוזת חיפוש
    const [filteredClients, setFilteredClients] = useState([]); // לקוחות מסוננים
    const router = useRouter();

    // טעינת הלקוחות מהמסד
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients();
                const clientsArray = data ? Object.entries(data) : [];
                setClients(clientsArray);
                setFilteredClients(clientsArray); // ברירת מחדל
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };
        fetchClients();
    }, []);

    // פונקציה לסינון הלקוחות לפי חיפוש
    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = clients.filter(([, client]) =>
            client.name?.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredClients(filtered);
    }, [searchTerm, clients]);

    // מחיקת לקוח
    const handleDeleteClient = async (id, name) => {
        const confirmation = window.confirm(`האם אתה בטוח שברצונך למחוק את הלקוח "${name}"?`);
        if (!confirmation) return;

        try {
            await deleteClient(id);
            setClients((prev) => prev.filter(([clientId]) => clientId !== id));
            setFilteredClients((prev) => prev.filter(([clientId]) => clientId !== id));
            alert(`הלקוח "${name}" נמחק בהצלחה.`);
        } catch (error) {
            console.error("Error deleting client:", error);
            alert("אירעה שגיאה בעת מחיקת הלקוח. נסה שוב.");
        }
    };

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

            {/* הצגת רשימת הלקוחות */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredClients.map(([id, client]) => (
                    <div key={id} className="relative">
                        {/* שימוש ברכיב ClientCard */}
                        <ClientCard id={id} client={client} />

                        {/* כפתור מחיקה */}
                        <button
                            onClick={() => handleDeleteClient(id, client.name)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientsPage;
