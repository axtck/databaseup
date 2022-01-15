#!/usr/bin/env node

import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

import { getCreateArgs, handleExceptionLazy, successText } from "../utils";

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
        const migrationName: string = getCreateArgs()[0];
        const srcFolder: string = getCreateArgs()[1];
        const migrationsFolder: string = path.resolve(".", srcFolder, "migrations");
        await mkdirp(migrationsFolder);
        const migrationPath = path.resolve(migrationsFolder, `${migrationName}.ts`);
        console.log(migrationPath);
        fs.writeFileSync(migrationPath, migrationFileContent);
    } catch (e) {
        handleExceptionLazy(e, "writing migration failed");
        console.log(successText("Arg 1: migration name"));
        console.log(successText("Arg 2: /src folder name"));
    }
};

write().catch((e) => {
    handleExceptionLazy(e, "something went wrong");
});