import path from "path";
import mysql from "mysql2/promise";
import { upgradeDatabase } from "../upgrade";

describe("upgrade", () => {
    const migrationsPath = path.resolve(path.join(".", "src", "tests", "migrations"));
    const createTestConnection = async (): Promise<mysql.Connection> => {
        const connection: mysql.Connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "admin"
        });
        return connection;
    };
    it("should succeed", async () => {
        const connection: mysql.Connection = await createTestConnection();
        await upgradeDatabase(migrationsPath, connection);
    });
});