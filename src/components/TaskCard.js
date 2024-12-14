// src/components/TaskCard.js
import React from 'react';

const TaskCard = ({ id, taskData }) => {
    const { taskName, dueDate, status } = taskData;

    const handleMarkComplete = () => {
        console.log(`Marking task as complete: ${id}`);
    };

    const handleEditTask = () => {
        console.log(`Editing task: ${id}`);
    };

    const handleDeleteTask = () => {
        console.log(`Deleting task: ${id}`);
    };

    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{taskName}</h2>
            <p className="text-sm text-gray-600 mb-2">תאריך יעד: {new Date(dueDate).toLocaleDateString('he-IL')}</p>
            <p className={`text-sm mb-2 ${status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                סטטוס: {status === 'completed' ? 'הושלם' : 'לא הושלם'}
            </p>
            <div className="flex space-x-2">
                <button 
                    onClick={handleMarkComplete} 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    סמן כהושלם
                </button>
                <button 
                    onClick={handleEditTask} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    ערוך
                </button>
                <button 
                    onClick={handleDeleteTask} 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    מחק
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
