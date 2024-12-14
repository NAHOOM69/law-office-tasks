// /pages/api/export-csv.js
import { database } from "../../lib/firebase";
import { ref, get } from "firebase/database";
import { parse } from "json2csv";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).send("Method not allowed");
    }

    try {
        const dbRef = ref(database);
        const snapshot = await get(dbRef);
        const data = snapshot.val();

        if (!data) {
            return res.status(404).send("No data found");
        }

        const csv = parse(data);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=data_export.csv");
        res.status(200).send(csv);
    } catch (error) {
        console.error("Error exporting data:", error);
        res.status(500).send("Error exporting data");
    }
}
