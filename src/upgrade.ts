import { readdir } from "fs/promises";
import mysql from "mysql2";
import path from "path";
import { IMigrationFile } from "./types";
import { handleExceptionLazy } from "./utils";

export const upgradeDatabase = async (migrationsFolderPath: string, connection: mysql.Connection) => {
    try {
        const files = await readdir(migrationsFolderPath);
        for (const file of files) {
            const migration: IMigrationFile = await import(path.resolve(path.join(migrationsFolderPath, file)));
            if (!migration.upgrade) {
                throw new Error(`migration ${file} doesn't have an upgrade function`);
            }

            await migration.upgrade(connection);
        }
    } catch (e) {
        handleExceptionLazy(e, "upgrading database failed");
    }
};