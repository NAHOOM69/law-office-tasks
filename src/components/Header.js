import React from "react";
import Link from "next/link";
import { Home, Briefcase, ListTodo, User, Download, Upload } from "lucide-react";

const Header = () => {
    const handleExport = async () => {
        try {
            const response = await fetch("/api/export-csv");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "data_export.csv";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("אירעה שגיאה במהלך ייצוא הנתונים.");
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/import-csv", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("נתונים יובאו בהצלחה!");
            } else {
                console.error("Error importing data:", await response.text());
                alert("אירעה שגיאה במהלך ייבוא הנתונים.");
            }
        } catch (error) {
            console.error("Error importing data:", error);
            alert("אירעה שגיאה במהלך ייבוא הנתונים.");
        }
    };

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
            <h1 className="text-xl font-bold text-gray-800">ניהול משפטי</h1>
            <nav className="flex space-x-6">
                <Link href="/" legacyBehavior>
                    <a className="flex items-center text-gray-600 hover:text-blue-600">
                        <Home size={28} />
                    </a>
                </Link>
                <Link href="/clients" legacyBehavior>
                    <a className="flex items-center text-gray-600 hover:text-blue-600">
                        <User size={28} />
                    </a>
                </Link>
                <Link href="/cases" legacyBehavior>
                    <a className="flex items-center text-gray-600 hover:text-blue-600">
                        <Briefcase size={28} />
                    </a>
                </Link>
                <Link href="/tasks" legacyBehavior>
                    <a className="flex items-center text-gray-600 hover:text-blue-600">
                        <ListTodo size={28} />
                    </a>
                </Link>
                {/* ייצוא נתונים */}
                <button
                    onClick={handleExport}
                    className="flex items-center text-gray-600 hover:text-green-600"
                >
                    <Download size={28} />
                </button>
                {/* ייבוא נתונים */}
                <label className="flex items-center text-gray-600 hover:text-orange-600 cursor-pointer">
                    <Upload size={28} />
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleImport}
                        className="hidden"
                    />
                </label>
            </nav>
        </header>
    );
};

export default Header;
