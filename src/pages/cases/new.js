import React, { useState, useEffect } from "react";
import { ref, push, get, set } from "firebase/database";
import { database } from "../../lib/firebase";
import { useRouter } from "next/router";
import { X } from "lucide-react";

const NewCase = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [caseName, setCaseName] = useState("");
    //const [caseSubject, setCaseSubject] = useState("");
    //const [internalNumber, setInternalNumber] = useState("");
    //const [courtNumber, setCourtNumber] = useState("");
    //const [opponent, setOpponent] = useState("");
    //const [status, setStatus] = useState("פתוח");
    const [courtName, setCourtName] = useState(""); // שדה לשם בית המשפט
    const [judgeName, setJudgeName] = useState(""); // שדה לשם השופט
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const dbRef = ref(database, "clients");
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const clientsData = snapshot.val();
                    setClients(Object.entries(clientsData));
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        fetchClients();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!selectedClient || !caseName) {
            setError("יש לבחור לקוח ולמלא את שם התיק");
            return;
        }

        try {
            const selectedClientData = clients.find(([id]) => id === selectedClient);
            const clientName = selectedClientData ? selectedClientData[1].name : "";

            const newCaseRef = push(ref(database, "cases"));
            const newCaseKey = newCaseRef.key;

            // שמירת התיק בנתיב 'cases'
            await set(newCaseRef, {
                clientId: selectedClient,
                clientName,
                caseName,
                caseSubject,
                internalNumber: internalNumber || null,
                courtNumber: courtNumber || null,
                opponent: opponent || null,
                status,
                courtName, // שמירת שם בית המשפט
                judgeName, // שמירת שם השופט
            });

            // קישור התיק ללקוח בנתיב 'clients/{clientId}/cases/{caseId}'
            const clientCaseRef = ref(database, `clients/${selectedClient}/cases/${newCaseKey}`);
            await set(clientCaseRef, { caseName });

            router.push("/cases");
        } catch (err) {
            console.error("Error saving case:", err);
            setError("אירעה שגיאה בשמירת התיק. נסה שוב.");
        }
    };

    const handleCancel = () => {
        router.push("/cases");
    };

    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 rtl">
                <h1 className="text-2xl font-bold text-right text-gray-800 mb-4">הוספת תיק חדש</h1>
                {error && <p className="text-red-500 text-right mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם הלקוח:</label>
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        >
                            <option value="">בחר לקוח</option>
                            {clients.map(([id, client]) => (
                                <option key={id} value={id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם התיק:</label>
                        <input
                            type="text"
                            value={caseName}
                            onChange={(e) => setCaseName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס את שם התיק"
                            dir="rtl"
                        />
                    </div>
                    {/* שדות עבור שם בית המשפט ושם השופט */}
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם בית המשפט:</label>
                        <input
                            type="text"
                            value={courtName}
                            onChange={(e) => setCourtName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס את שם בית המשפט"
                            dir="rtl"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם השופט:</label>
                        <input
                            type="text"
                            value={judgeName}
                            onChange={(e) => setJudgeName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס את שם השופט"
                            dir="rtl"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center space-x-2"
                        >
                            <X size={20} />
                            <span>ביטול</span>
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            שמירה
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewCase;
