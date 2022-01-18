import path from "path";
import mysql from "mysql2";
import { upgradeDatabase } from "../upgrade";

describe("upgrade", () => {
    const migrationsPath = path.resolve(path.join(".", "src", "tests", "migrations"));
    const connection: mysql.Connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "admin"
    });

    it("should succeed", async () => {
        await upgradeDatabase(migrationsPath, connection);
    });
});