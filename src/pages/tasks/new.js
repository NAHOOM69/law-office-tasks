// src/pages/tasks/new.js

import React, { useState, useEffect } from "react";
import { ref, get, push, set } from "firebase/database";
import { database } from "../../lib/firebase";
import { useRouter } from "next/router";
import { X } from "lucide-react";

const NewTask = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState("");
    const [taskName, setTaskName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Fetch clients from Firebase
        const fetchClients = async () => {
            try {
                const clientsRef = ref(database, "clients");
                const snapshot = await get(clientsRef);
                if (snapshot.exists()) {
                    const clientsData = snapshot.val();
                    const sortedClients = Object.entries(clientsData).sort((a, b) =>
                        a[1].name.localeCompare(b[1].name)
                    );
                    setClients(sortedClients);
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };
        fetchClients();
    }, []);
    useEffect(() => {
        const fetchCases = async () => {
            if (!selectedClient) {
                setCases([]);
                return;
            }
            try {
                const clientCasesRef = ref(database, `clients/${selectedClient}/cases`);
                const snapshot = await get(clientCasesRef);
                if (snapshot.exists()) {
                    const caseIds = Object.keys(snapshot.val());
                    const casesData = [];
                    for (const caseId of caseIds) {
                        const caseSnapshot = await get(ref(database, `cases/${caseId}`));
                        if (caseSnapshot.exists()) {
                            casesData.push({ id: caseId, ...caseSnapshot.val() });
                        }
                    }
                    const sortedCases = casesData.sort((a, b) =>
                        a.caseName.localeCompare(b.caseName)
                    );
                    setCases(sortedCases);
                } else {
                    setCases([]);
                }
            } catch (error) {
                console.error("Error fetching cases for the selected client:", error);
            }
        };
    
        fetchCases();
    }, [selectedClient]);
    
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!selectedClient || !selectedCase || !taskName) {
            setError("יש לבחור לקוח, תיק ולמלא את שם המשימה");
            return;
        }

        try {
            const newTaskRef = push(ref(database, "tasks"));
            await set(newTaskRef, {
                clientId: selectedClient,
                caseId: selectedCase,
                taskName,
                dueDate: dueDate || null,
                reminderDate: reminderDate || null,
            });

            router.push("/tasks");
        } catch (err) {
            console.error("Error saving task:", err);
            setError("אירעה שגיאה בשמירת המשימה. נסה שוב.");
        }
    };

    const handleCancel = () => {
        router.push("/tasks");
    };

    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 rtl">
                <h1 className="text-2xl font-bold text-right text-gray-800 mb-4">הוספת משימה חדשה</h1>
                {error && <p className="text-red-500 text-right mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
    <label className="block font-medium text-right text-gray-700 mb-2">בחר לקוח:</label>
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
    <label className="block font-medium text-right text-gray-700 mb-2">בחר תיק:</label>
    <select
        value={selectedCase}
        onChange={(e) => setSelectedCase(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        disabled={!selectedClient}
    >
        <option value="">בחר תיק</option>
        {cases.map((caseData) => (
            <option key={caseData.id} value={caseData.id}>
                {caseData.caseName}
            </option>
        ))}
    </select>
</div>

                  
                  
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם המשימה:</label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס את שם המשימה"
                            dir="rtl"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">תאריך יעד:</label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">תאריך תזכורת:</label>
                        <input
                            type="datetime-local"
                            value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
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

export default NewTask;
