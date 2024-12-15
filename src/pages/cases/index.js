// src/pages/cases/index.js
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCases, updateCaseStatus, deleteCase } from "../../utils/firebase";
import { Edit2, Trash2 } from "lucide-react";

const CasesPage = () => {
    const [cases, setCases] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // מצב חיפוש

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const data = await getCases();
                setCases(data ? Object.entries(data) : []);
            } catch (error) {
                console.error("Error fetching cases:", error);
            }
        };
        fetchCases();
    }, []);

    const handleStatusChange = async (id, currentStatus) => {
        const statuses = ["פתוח", "ממתין", "סגור"];
        const nextStatusIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
        const nextStatus = statuses[nextStatusIndex];

        try {
            await updateCaseStatus(id, nextStatus);
            setCases((prevCases) =>
                prevCases.map(([caseId, caseData]) =>
                    caseId === id ? [caseId, { ...caseData, status: nextStatus }] : [caseId, caseData]
                )
            );
        } catch (error) {
            console.error("Error updating case status:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCase(id);
            setCases((prevCases) => prevCases.filter(([caseId]) => caseId !== id));
        } catch (error) {
            console.error("Error deleting case:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "פתוח":
                return "bg-green-500 text-white";
            case "ממתין":
                return "bg-yellow-500 text-white";
            case "סגור":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const filteredCases = cases.filter(([, caseData]) =>
        Object.values(caseData).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

   // const filteredClients = clients.filter(([, client]) =>
   //     client.name?.toLowerCase().includes(lowerCaseSearchTerm)
   // );

    return (
        <div className="p-4 rtl">
            <h1 className="text-2xl font-bold mb-4 text-right">תיקים</h1>

            {/* חלונית חיפוש */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="חפש תיק..."
                    className="w-1/3 border border-gray-300 rounded px-3 py-2 text-right"
                />
            </div>

            {/* כפתור מרחף להוספת תיק חדש */}
            <div className="fixed bottom-4 right-4 z-50">
    <Link
        href="/cases/new"
        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
        style={{ width: "60px", height: "60px" }}
    >
        +
    </Link>
</div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCases.map(([id, caseData]) => (
                    <div
                        key={id}
                        className="border rounded-lg shadow-md p-4 bg-white flex flex-col space-y-2 text-right"
                    >
                        <h2 className="text-lg font-bold text-gray-800">{caseData.clientName}</h2>
                        <p className="text-sm text-gray-600">שם התיק: {caseData.caseName}</p>
                        <p className="text-sm text-gray-600">נושא התיק: {caseData.caseSubject || "לא צויין"}</p>
                        <p className="text-sm text-gray-600">מס פנימי: {caseData.internalNumber || "לא צויין"}</p>
                        <p className="text-sm text-gray-600">מס תיק בית משפט: {caseData.courtNumber || "לא צויין"}</p>
                        <p className="text-sm text-gray-600">שם הצד השני: {caseData.opponent || "לא צויין"}</p>
                        <p className="text-sm text-gray-600">שם בית המשפט: {caseData.courtName || "לא צויין"}</p>
                        <p className="text-sm text-gray-600">שם השופט: {caseData.judgeName || "לא צויין"}</p>

                        <div className="flex items-center justify-end space-x-4">
                            <button
                                onClick={() => handleStatusChange(id, caseData.status)}
                                className={`px-3 py-1 rounded ${getStatusColor(caseData.status)}`}
                            >
                                {caseData.status || "פתוח"}
                            </button>
                            <div className="flex space-x-4">
                                <Link href={`/cases/edit?id=${id}`}>
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <Edit2 size={20} />
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDelete(id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CasesPage;
