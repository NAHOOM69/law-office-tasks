import admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert("./path/to/serviceAccountKey.json"),
    databaseURL: "https://law-office-tasks-default-rtdb.europe-west1.firebasedatabase.app/"
});

const db = admin.database();

db.ref("/").once("value", (snapshot) => {
    console.log("Database connected successfully, data: ", snapshot.val());
}).catch((error) => {
    console.error("Error connecting to the database: ", error);
});
