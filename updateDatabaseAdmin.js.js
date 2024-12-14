import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json"; // כאן יש להוסיף את הנתיב לקובץ מפתח השירות שלך.

// אתחול Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://law-office-tasks-default-rtdb.europe-west1.firebasedatabase.app/", // החלף בשם מסד הנתונים שלך.
});

const database = admin.database();

const updateDatabaseStructure = async () => {
    try {
        // קריאת תיקים
        const casesRef = database.ref("cases");
        const casesSnapshot = await casesRef.once("value");
        const casesData = casesSnapshot.val();

        if (!casesData) {
            console.log("No cases found.");
            return;
        }

        // קריאת משימות
        const tasksRef = database.ref("tasks");
        const tasksSnapshot = await tasksRef.once("value");
        const tasksData = tasksSnapshot.val() || {};

        // יצירת עדכונים
        const updates = {};

        Object.keys(casesData).forEach((caseId) => {
            const caseData = casesData[caseId];
            const clientId = caseData.clientId;

            if (!clientId) return;

            // קישור התיק ללקוח
            updates[`clients/${clientId}/cases/${caseId}`] = true;

            // קישור משימות לתיקים
            if (caseData.tasks) {
                Object.keys(caseData.tasks).forEach((taskId) => {
                    if (tasksData[taskId]) {
                        updates[`tasks/${taskId}/clientId`] = clientId;
                        updates[`tasks/${taskId}/caseId`] = caseId;
                    }
                });
            }
        });

        // עדכון בבסיס הנתונים
        await database.ref().update(updates);
        console.log("Database structure updated successfully.");
    } catch (error) {
        console.error("Error updating database structure:", error);
    }
};

updateDatabaseStructure();
