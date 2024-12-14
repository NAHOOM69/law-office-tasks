// src/components/CaseCard.js
import React from 'react';

const CaseCard = ({ id, caseData }) => {
    const { caseName, courtName, status } = caseData;

    const handleViewDetails = () => {
        console.log(`Viewing details for case: ${id}`);
    };

    const handleEditCase = () => {
        console.log(`Editing case: ${id}`);
    };

    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{caseName}</h2>
            <p className="text-sm text-gray-600 mb-2">בית משפט: {courtName}</p>
            <p className={`text-sm mb-2 ${status === 'active' ? 'text-green-500' : status === 'pending' ? 'text-orange-500' : 'text-gray-500'}`}>
                סטטוס: {status === 'active' ? 'פעיל' : status === 'pending' ? 'בהמתנה' : 'סגור'}
            </p>
            <div className="flex space-x-2">
                <button 
                    onClick={handleViewDetails} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    פרטים
                </button>
                <button 
                    onClick={handleEditCase} 
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                    ערוך
                </button>
            </div>
        </div>
    );
};

export default CaseCard;