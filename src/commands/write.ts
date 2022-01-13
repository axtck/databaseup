import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

import { getMigrationNameFromArgv, handleExceptionLazy } from "../utils";

const migrationFileContent: string = `import mysql from "mysql2/promise";

export const upgrade = async (connection: mysql.Connection): Promise<void> => {
    const [rows] = await connection.query("show databases")
    console.log(rows);
}

export const downgrade = async (connection: mysql.Connection): Promise<void> => {
    const [rows] = await connection.query("show databases")
    console.log(rows);
}`;

const write = async (): Promise<void> => {
    try {
        const migrationName: string = getMigrationNameFromArgv();
        const migrationsFolder: string = path.resolve(".", "migrations");
        await mkdirp(migrationsFolder);
        const migrationPath = path.resolve(migrationsFolder, `${migrationName}.ts`);
        console.log(migrationPath);
        fs.writeFileSync(migrationPath, migrationFileContent);
    } catch (e) {
        handleExceptionLazy(e, "writing migration failed");
    }
};

write().catch((e) => {
    handleExceptionLazy(e, "something went wrong");
});