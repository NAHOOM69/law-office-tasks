// src/pages/tasks/edit.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getTaskById, updateTask } from "../../utils/firebase";
import { X } from "lucide-react";
//import { ref, get, update } from "firebase/database";
//import { database } from "../../../lib/firebase";


const EditTask = () => {
    const router = useRouter();
    const { taskId } = router.query; // קבלת מזהה המשימה מ-URL
    const [taskData, setTaskData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTaskData = async () => {
            if (!taskId) return; // בדוק אם ה-taskId זמין
            try {
                const task = await getTaskById(taskId); // שליפת הנתונים מהפונקציה
                if (task) {
                    setTaskData(task);
                } else {
                    console.error("Task not found");
                }
            } catch (error) {
                console.error("Error fetching task:", error);
            }
        };
    
        fetchTaskData();
    }, [taskId]);
    

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");

        if (!taskData.taskName || !taskData.dueDate) {
            setError("יש למלא את שם המשימה ותאריך יעד");
            return;
        }

        try {
            await updateTask(taskId, taskData); // עדכון המשימה ב-Firebase
            router.push("/tasks");
        } catch (err) {
            console.error("Error updating task:", err);
            setError("אירעה שגיאה בעת שמירת המשימה. נסה שוב.");
        }
    };

    const handleCancel = () => {
        router.push("/tasks");
    };

    if (!taskData) {
        return <p>טוען נתוני משימה...</p>;
    }

    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 rtl">
                <h1 className="text-2xl font-bold text-right text-gray-800 mb-4">עריכת משימה</h1>
                {error && <p className="text-red-500 text-right mb-4">{error}</p>}
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם הלקוח:</label>
                        <input
                            type="text"
                            value={taskData.clientName || ""}
                            disabled
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-200 text-right"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם התיק:</label>
                        <input
                            type="text"
                            value={taskData.caseName || ""}
                            disabled
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-200 text-right"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">שם המשימה:</label>
                        <input
                            type="text"
                            value={taskData.taskName || ""}
                            onChange={(e) => setTaskData({ ...taskData, taskName: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-right"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">תאריך יעד:</label>
                        <input
                            type="datetime-local"
                            value={taskData.dueDate || ""}
                            onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-right"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-right text-gray-700 mb-2">תאריך תזכורת:</label>
                        <input
                            type="datetime-local"
                            value={taskData.reminderDate || ""}
                            onChange={(e) => setTaskData({ ...taskData, reminderDate: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-right"
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

export default EditTask;
