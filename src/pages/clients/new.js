import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database } from "../../lib/firebase";
import { useRouter } from "next/router";
import { X } from "lucide-react";

const NewClient = () => {
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [contactPerson, setContactPerson] = useState(""); // שדה איש קשר
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!clientName) {
            setError("יש למלא את שם הלקוח");
            return;
        }

        try {
            // יצירת מזהה לקוח חדש
            const newClientRef = push(ref(database, "clients"));
            const newClientKey = newClientRef.key;

            // שמירת הלקוח במסד הנתונים
            await set(newClientRef, {
                name: clientName,
                phone: clientPhone || null,
                email: clientEmail || null,
                contactPerson: contactPerson || null,
            });

            // יצירת תיק חדש בשם "כללי" תחת הלקוח
            const newCaseRef = push(ref(database, "cases"));
            const newCaseKey = newCaseRef.key;

            // שמירת התיק בנתיב 'cases'
            await set(newCaseRef, {
                clientId: newClientKey,
                clientName,
                caseName: "כללי",
                caseSubject: null,
                internalNumber: null,
                courtNumber: null,
                opponent: null,
                status: "פתוח",
                courtName: null,
                judgeName: null,
            });

            // קישור התיק ללקוח בנתיב 'clients/{clientId}/cases/{caseId}'
            const clientCaseRef = ref(
                database,
                `clients/${newClientKey}/cases/${newCaseKey}`
            );
            await set(clientCaseRef, { caseName: "כללי" });

            alert("הלקוח והתיק נוצרו בהצלחה!");
            router.push("/clients");
        } catch (err) {
            console.error("Error saving client or case:", err);
            setError("אירעה שגיאה בשמירת הלקוח או התיק. נסה שוב.");
        }
    };

    const handleCancel = () => {
        router.push("/clients");
    };

    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="fixed bottom-4 right-4 z-50">
            </div>

            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 rtl">
                <h1 className="text-2xl font-bold text-right text-gray-800 mb-4">הוספת לקוח חדש</h1>
                {error && <p className="text-red-500 text-right mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם הלקוח:</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס את שם הלקוח"
                            dir="rtl"
                        />
                    </div>

                    <div>
                    <label className="block font-medium text-right text-gray-700 mb-2">איש קשר:</label>
                    <input
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        placeholder="הכנס את שם איש הקשר"
                        dir="rtl"
                    />
                </div>

                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">טלפון:</label>
                        <input
                            type="tel"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס את מספר הטלפון"
                            dir="rtl"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">דואר אלקטרוני:</label>
                        <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                            placeholder="הכנס את כתובת הדואל"
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

export default NewClient;
