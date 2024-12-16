// פונקציה לנרמול נתיב
const normalizePath = (path) => {
    if (path.startsWith("d:")) {
        return path.replace("d:", "D:");
    }
    return path;
};

const correctedPath = normalizePath(__dirname);
console.log("Corrected Path:", correctedPath); // יוודא שהנתיב מתחיל ב-D:

// ייבוא Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, remove } from "firebase/database";

// הגדרת קובץ Firebase
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// אתחול Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// פונקציות לשימוש ב-Firebase
export const getClientById = async (clientId) => {
    try {
        const dbRef = ref(database, `clients/${clientId}`);
        const snapshot = await get(dbRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error fetching client:", error);
        return null;
    }
};

export const getCasesByClient = async (clientId) => {
    try {
        const dbRef = ref(database, `clients/${clientId}/cases`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const caseIds = Object.keys(snapshot.val());
            const cases = [];
            for (const caseId of caseIds) {
                const caseSnapshot = await get(ref(database, `cases/${caseId}`));
                if (caseSnapshot.exists()) {
                    cases.push({ id: caseId, ...caseSnapshot.val() });
                }
            }
            return cases;
        }
        return [];
    } catch (error) {
        console.error("Error fetching cases for client:", error);
        return [];
    }
};

export const getTasksByCase = async (caseId) => {
    try {
        const dbRef = ref(database, `cases/${caseId}/tasks`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const taskIds = Object.keys(snapshot.val());
            const tasks = [];
            for (const taskId of taskIds) {
                const taskSnapshot = await get(ref(database, `tasks/${taskId}`));
                if (taskSnapshot.exists()) {
                    tasks.push(taskSnapshot.val());
                }
            }
            return tasks;
        }
        return [];
    } catch (error) {
        console.error("Error fetching tasks for case:", error);
        return [];
    }
};

export const getClients = async () => {
    try {
        const dbRef = ref(database, "clients");
        const snapshot = await get(dbRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error fetching clients:", error);
        return null;
    }
};

export const getCases = async () => {
    try {
        const dbRef = ref(database, "cases");
        const snapshot = await get(dbRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error fetching cases:", error);
        return null;
    }
};

export const getTasks = async () => {
    try {
        const dbRef = ref(database, "tasks");
        const snapshot = await get(dbRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return null;
    }
};

export const updateCaseStatus = async (caseId, status) => {
    if (!caseId) throw new Error("Case ID is required");
    try {
        const dbRef = ref(database, `cases/${caseId}`);
        await update(dbRef, { status }); // מעדכן את הסטטוס של התיק
    } catch (error) {
        console.error("Error updating case status:", error);
        throw error;
    }
};

export const deleteCase = async (caseId) => {
    if (!caseId) throw new Error("Case ID is required");
    try {
        const dbRef = ref(database, `cases/${caseId}`);
        await remove(dbRef); // מחיקת התיק ממסד הנתונים
        console.log(`Case with ID ${caseId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting case:", error);
        throw error;
    }
};

export const getTaskById = async (taskId) => {
    try {
        const taskRef = ref(database, `tasks/${taskId}`);
        const snapshot = await get(taskRef);
        if (snapshot.exists()) {
            const taskData = snapshot.val();
            
            // Fetch client and case details
            const clientData = taskData.clientId
                ? await get(ref(database, `clients/${taskData.clientId}`))
                : null;
            const caseData = taskData.caseId
                ? await get(ref(database, `cases/${taskData.caseId}`))
                : null;

            return {
                ...taskData,
                clientName: clientData?.val()?.name || "לקוח לא נמצא",
                caseName: caseData?.val()?.caseName || "תיק לא נמצא",
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        throw error;
    }
};


export const updateTask = async (taskId, updatedData) => {
    if (!taskId || !updatedData) throw new Error("Task ID and updated data are required");
    try {
        const taskRef = ref(database, `tasks/${taskId}`);
        await update(taskRef, updatedData);
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

export const deleteClient = async (clientId) => {
    const clientRef = ref(database, `clients/${clientId}`);
    await remove(clientRef);
};




export const getCaseById = async (caseId) => {
    try {
        const caseRef = ref(database, `cases/${caseId}`);
        const snapshot = await get(caseRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error fetching case by ID:", error);
        throw error;
    }
};


export { database, ref };
