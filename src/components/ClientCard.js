import React from "react";
import { Phone, Mail, MessageSquare } from "lucide-react";


const ClientCard = ({ client }) => {
    const { name, phone, email } = client;

//const ClientCard = ({ id, client }) => {
//    const { name, phone, email } = client;//

    const handlePhoneClick = () => {
        window.location.href = `tel:${phone}`;
    };

    const handleEmailClick = () => {
        window.location.href = `mailto:${email}`;
    };

    const handleWhatsAppClick = () => {
        const formattedPhone = phone.replace(/\D/g, ""); // Remove non-digit characters
        window.open(`https://wa.me/${formattedPhone}`, "_blank");
    };

    return (
        <div className="border rounded-lg p-4 shadow-md bg-white flex flex-col rtl text-right">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{name}</h2>
            <p className="text-sm text-gray-600 mb-2">טלפון: {phone}</p>
            <p className="text-sm text-gray-600 mb-4">אימייל: {email}</p>
            <div className="flex space-x-2 justify-start">
                <button
                    onClick={handlePhoneClick}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    <Phone size={20} />
                </button>
                <button
                    onClick={handleEmailClick}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    <Mail size={20} />
                </button>
                <button
                    onClick={handleWhatsAppClick}
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                >
                    <MessageSquare size={20} />
                </button>
            </div>
        </div>
    );
};

export default ClientCard;
