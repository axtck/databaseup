import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

import { getCreateArgs, handleExceptionLazy, successText } from "./utils";

const migrationFileContent: string = `import mysql from "mysql2/promise";

export const upgrade = async (connection: mysql.Connection): Promise<void> => {
    const [rows] = await connection.query("show databases")
    console.log(rows);
}

export const downgrade = async (connection: mysql.Connection): Promise<void> => {
    const [rows] = await connection.query("show databases")
    console.log(rows);
}`;

export const create = async (): Promise<void> => {
    try {
        const timestamp: number = new Date().getTime();
        const migrationFileName: string = `${timestamp}_${getCreateArgs().name}.ts`;
        const srcFolder: string = getCreateArgs().srcFolder;
        const migrationsFolder: string = path.resolve(".", srcFolder, "migrations");
        await mkdirp(migrationsFolder);
        const migrationPath = path.resolve(migrationsFolder, migrationFileName);
        fs.writeFileSync(migrationPath, migrationFileContent);
        console.log(successText("successfully created migration"));
        console.log(successText(migrationPath));
    } catch (e) {
        handleExceptionLazy(e, "creating migration failed");
        console.log(successText("arg 1: migration name"));
        console.log(successText("arg 2: /src folder name"));
    }
};