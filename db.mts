import sqlite3 from "sqlite3";
import { nanoid } from "nanoid";

// Initalise the database
const db = new sqlite3.Database("data.db");

db.run(
    "CREATE TABLE IF NOT EXISTS unknownPaths (id TEXT MASTER KEY, userAgent TEXT, pathName TEXT)"
);

export function addPath(userAgent: string, path: string) {
    db.run(
        "INSERT INTO unknownPaths VALUES (?, ?, ?)",
        nanoid(),
        userAgent,
        path
    );

    console.log("Recorded", userAgent, path);
}
