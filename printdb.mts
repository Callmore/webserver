import sqlite3 from "sqlite3";

// Initalise the database
const db = new sqlite3.Database("data.db");

db.all("SELECT * FROM unknownPaths", function (err, lines) {
    console.log(lines);
});
