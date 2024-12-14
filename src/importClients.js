import fs from "fs";
import csv from "csv-parser";
import { ref, push, set } from "firebase/database";
import { database } from "../lib/firebase"; // עדכן את הנתיב לנתיב הנכון


const importClients = async () => {
    const filePath = "./clients.csv"; // נתיב הקובץ
    const clientsRef = ref(database, "clients");

    try {
        const clients = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                const client = {
                    name: row.name || null,
                    contactPerson: row.contactPerson || null,
                    email: row.email || null,
                    phone: row.phone || null,
                };
                clients.push(client);
            })
            .on("end", async () => {
                for (const client of clients) {
                    const newClientRef = push(clientsRef);
                    await set(newClientRef, client);
                }
                console.log("ייבוא הלקוחות הסתיים בהצלחה!");
            });
    } catch (error) {
        console.error("אירעה שגיאה במהלך הייבוא:", error);
    }
};

importClients();
