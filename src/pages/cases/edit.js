// src/pages/cases/edit.js
import React, { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../../lib/firebase";
import { useRouter } from "next/router";
import { X } from "lucide-react";

const EditCase = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [caseName, setCaseName] = useState("");
    const [caseSubject, setCaseSubject] = useState("");
    const [internalNumber, setInternalNumber] = useState("");
    const [courtNumber, setCourtNumber] = useState("");
    const [opponent, setOpponent] = useState("");
    const [status, setStatus] = useState("פתוח");
    const [courtName, setCourtName] = useState(""); // שם בית המשפט
    const [judgeName, setJudgeName] = useState(""); // שם השופט
    const [clientName, setClientName] = useState(""); // שם הלקוח
    const [error, setError] = useState("");
    const router = useRouter();
    const { id } = router.query;

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

        const fetchCase = async () => {
            if (!id) return;

            try {
                const caseRef = ref(database, `cases/${id}`);
                const snapshot = await get(caseRef);

                if (snapshot.exists()) {
                    const caseData = snapshot.val();
                    setSelectedClient(caseData.clientId || "");
                    setClientName(caseData.clientName || ""); // שליפת שם הלקוח
                    setCaseName(caseData.caseName || "");
                    setCaseSubject(caseData.caseSubject || "");
                    setInternalNumber(caseData.internalNumber || "");
                    setCourtNumber(caseData.courtNumber || "");
                    setOpponent(caseData.opponent || "");
                    setStatus(caseData.status || "פתוח");
                    setCourtName(caseData.courtName || ""); // שליפת שם בית המשפט
                    setJudgeName(caseData.judgeName || ""); // שליפת שם השופט
                }
            } catch (error) {
                console.error("Error fetching case data:", error);
            }
        };

        fetchClients();
        fetchCase();
    }, [id]);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        if (!selectedClient || !caseName) {
            setError("יש לבחור לקוח ולמלא את שם התיק");
            return;
        }
    
        try {
            // שליפת שם הלקוח על פי הלקוח שנבחר
            const selectedClientData = clients.find(([id]) => id === selectedClient);
            const clientName = selectedClientData ? selectedClientData[1].name : ""; // כאן מגדירים את שם הלקוח
    
            // יצירת reference לנתיב התיק ב-Firebase
            const caseRef = ref(database, `cases/${id}`); // השתמש במזהה התיק לעריכה
    
            // שמירת המידע המעודכן
            await set(caseRef, {
                clientId: selectedClient,
                clientName, // שמירת שם הלקוח
                caseName,
                caseSubject,
                internalNumber: internalNumber || null,
                courtNumber: courtNumber || null,
                opponent: opponent || null,
                courtName: courtName || "",
                judgeName: judgeName || "",
                status,
            });
    
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
                <h1 className="text-2xl font-bold text-right text-gray-800 mb-4">עריכת תיק</h1>
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
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">נושא התיק:</label>
                        <input
                            type="text"
                            value={caseSubject}
                            onChange={(e) => setCaseSubject(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס את נושא התיק"
                            dir="rtl"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">מס' פנימי:</label>
                        <input
                            type="text"
                            value={internalNumber}
                            onChange={(e) => setInternalNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס מס' פנימי"
                            dir="rtl"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">מס' תיק בבית המשפט:</label>
                        <input
                            type="text"
                            value={courtNumber}
                            onChange={(e) => setCourtNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס מס' תיק בבית המשפט"
                            dir="rtl"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם הצד השני:</label>
                        <input
                            type="text"
                            value={opponent}
                            onChange={(e) => setOpponent(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס את שם הצד השני"
                            dir="rtl"
                        />
                    </div>
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
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">סטטוס תיק:</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        >
                            <option value="פתוח">פתוח</option>
                            <option value="ממתין">ממתין</option>
                            <option value="סגור">סגור</option>
                        </select>
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

export default EditCase;
