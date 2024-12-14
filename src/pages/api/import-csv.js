// /pages/api/import-csv.js
import { database } from "../../lib/firebase";
import { ref, update } from "firebase/database";
import csvParser from "csv-parser";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Error parsing form:", err);
            return res.status(500).send("Error parsing form");
        }

        const filePath = files.file.filepath;
        const data = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => data.push(row))
            .on("end", async () => {
                try {
                    const updates = {};
                    data.forEach((row, index) => {
                        const key = `imported_${index}`;
                        updates[key] = row;
                    });

                    const dbRef = ref(database);
                    await update(dbRef, updates);

                    res.status(200).send("Data imported successfully");
                } catch (error) {
                    console.error("Error importing data:", error);
                    res.status(500).send("Error importing data");
                }
            });
    });
}
