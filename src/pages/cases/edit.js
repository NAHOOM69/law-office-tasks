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
    const [courtName, setCourtName] = useState("");
    const [judgeName, setJudgeName] = useState("");
    const [isLoading, setIsLoading] = useState(true); // סטטוס טעינה
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
                    setCaseName(caseData.caseName || "");
                    setCaseSubject(caseData.caseSubject || "");
                    setInternalNumber(caseData.internalNumber || "");
                    setCourtNumber(caseData.courtNumber || "");
                    setOpponent(caseData.opponent || "");
                    setStatus(caseData.status || "פתוח");
                    setCourtName(caseData.courtName || "");
                    setJudgeName(caseData.judgeName || "");
                }
            } catch (error) {
                console.error("Error fetching case data:", error);
            } finally {
                setIsLoading(false); // סיום טעינה
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
            const selectedClientData = clients.find(([clientId]) => clientId === selectedClient);
            const clientName = selectedClientData ? selectedClientData[1].name : "";

            const caseRef = ref(database, `cases/${id}`);
            await set(caseRef, {
                clientId: selectedClient,
                clientName,
                caseName,
                caseSubject,
                internalNumber,
                courtNumber,
                opponent,
                courtName,
                judgeName,
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

    if (isLoading) {
        return <p className="text-center mt-8">טוען נתונים...</p>; // הצגת טעינה
    }

    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 rtl">
                <h1 className="text-2xl font-bold text-right text-gray-800 mb-4">עריכת תיק</h1>
                {error && <p className="text-red-500 text-right mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* בחירת לקוח */}
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

                    {/* שדות נוספים */}
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם התיק:</label>
                        <input
                            type="text"
                            value={caseName}
                            onChange={(e) => setCaseName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">נושא התיק:</label>
                        <input
                            type="text"
                            value={caseSubject}
                            onChange={(e) => setCaseSubject(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    {/* המשך שדות... */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            ביטול
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
