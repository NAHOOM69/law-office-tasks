import { useEffect } from "react";
import { useRouter } from "next/router";

const HomePage = () => {
    const router = useRouter();

    useEffect(() => {
        // הפניה אוטומטית לדף המשימות אם רוצים לעבור אוטומטית לדף זה
        const shouldRedirectToTasks = true; // שנה ל- false אם אינך רוצה הפניה אוטומטית
        if (shouldRedirectToTasks) {
            router.push("/tasks");
        }
    }, [router]);

    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 rtl text-right">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    אודות האפליקציה
                </h1>
                <p className="text-gray-700 mb-4">
                    אפליקציה זו נוצרה על ידי עו&quot;ד ניסים נחום, מתוך מטרה לספק פתרון לניהול חכם, יעיל ומסודר של לקוחות, תיקים ומשימות.
                </p>
                <p className="text-gray-700 mb-4">
                    האפליקציה מאפשרת לעקוב אחר סטטוס של משימות, לקוחות ותיקים, ומספקת כלים לשיפור ארגון העבודה ושיפור השירות ללקוחות.
                </p>
                <p className="text-gray-700">
                    תודה על השימוש באפליקציה, ונשמח לשמוע הצעות לשיפור בעתיד.
                </p>

            </div>
        </div>
    );
};

export default HomePage;
