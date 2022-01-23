import { readdir } from "fs/promises";
import mysql from "mysql2/promise";
import path from "path";
import { IMigrationFile, IMigrationFileInfo, CreatedStatus, DbQueryResult } from "./types";
import { convertFilename, handleExceptionLazy, successText } from "./utils";

export const upgradeDatabase = async (migrationsFolderPath: string, connection: mysql.Connection): Promise<void> => {
    try {
        // create migrations table
        const createTableStatus: CreatedStatus = await createMigrationsTable(connection);
        if (createTableStatus === CreatedStatus.Exists) console.log(successText("migrations table not created (exists)"));

        // get migrations
        const files: string[] = await readdir(migrationsFolderPath);
        const migrationsToRun: string[] = await getMigrationsToRun(connection, files);
        if (!migrationsToRun || !migrationsToRun.length) {
            console.log(successText("no migrations to run"));
            return;
        }

        // sort based on timestamp (chronological order)
        const sortedMigrationsToRun: string[] = migrationsToRun.sort((a, b) => {
            return convertFilename(a).timestamp - convertFilename(b).timestamp;
        });
        console.log(successText("migrations to run (in order):"));
        for (const migration of migrationsToRun) console.log(convertFilename(migration).timestamp);

        // upgrade all migrations to run
        for (const file of sortedMigrationsToRun) {

            // import migration
            const migration: IMigrationFile = await import(path.resolve(path.join(migrationsFolderPath, file)));
            if (!migration.upgrade) throw new Error(`migration ${file} doesn't have an upgrade function`);

            // extract info from migration filename
            const migrationFileInfo: IMigrationFileInfo = convertFilename(file);
            console.log(successText(`upgrading: migration ${migrationFileInfo.timestamp} (${migrationFileInfo.name})`));

            try {
                await migration.upgrade(connection);
                console.log(successText(`migration ${migrationFileInfo.timestamp} successfully upgraded`));
                await insertMigration(connection, migrationFileInfo, true);
            } catch (e) {
                await insertMigration(connection, migrationFileInfo, false);
                handleExceptionLazy(e, `migration ${migrationFileInfo.timestamp} failed upgrading`);
            }
        }
    } catch (e) {
        handleExceptionLazy(e, "upgrading database failed");
    }
};

const createMigrationsTable = async (connection: mysql.Connection): Promise<CreatedStatus> => {
    const [existingTable] = await connection.query<DbQueryResult<Array<unknown>>>("SHOW TABLES LIKE 'migrations'");
    if (existingTable && existingTable.length) return CreatedStatus.Exists;

    const createMigrationsTableQuery: string = `
        CREATE TABLE \`migrations\` (
            \`id\` bigint NOT NULL,
            \`name\` varchar(100) NOT NULL,
            \`succeeded\` tinyint(1) NOT NULL,
            \`created\` datetime NOT NULL,
            \`executed\` datetime NOT NULL,
            PRIMARY KEY (\`id\`)
        )
    `;

    await connection.query(createMigrationsTableQuery);
    return CreatedStatus.Created;
};

const insertMigration = async (connection: mysql.Connection, migrationFileInfo: IMigrationFileInfo, succeeded: boolean): Promise<void> => {
    const insertMigrationQuery: string = `
        INSERT INTO migrations 
        (id, name, succeeded, created, executed)
        VALUES(?, ?, ?, ?, ?)
    `;

    const parameters: Array<number | string | Date | boolean> = [
        migrationFileInfo.timestamp, // id
        migrationFileInfo.name, // name
        succeeded, // succeeded
        new Date(migrationFileInfo.timestamp), // created
        new Date() // executed
    ];

    await connection.query(insertMigrationQuery, parameters);
};

const getStoredMigrations = async (connection: mysql.Connection): Promise<Array<{ id: number; }>> => {
    const getStoredMigrationsQuery: string = "SELECT id FROM migrations";
    const [storedMigrations] = await connection.query<DbQueryResult<Array<{ id: number; }>>>(getStoredMigrationsQuery);
    return storedMigrations;
};

const getFailedMigrations = async (connection: mysql.Connection): Promise<Array<{ id: number; }>> => {
    const getMigrationsQuery: string = "SELECT id FROM migrations WHERE succeeded = FALSE";
    const [failedMigrations] = await connection.query<DbQueryResult<Array<{ id: number; }>>>(getMigrationsQuery);
    return failedMigrations;
};

const getMigrationsToRun = async (connection: mysql.Connection, migrationFiles: string[]): Promise<string[]> => {
    const storedMigrationIds = (await getStoredMigrations(connection)).map(m => m.id);
    const failedMigrationIds = (await getFailedMigrations(connection)).map(m => m.id);

    const newMigrations = migrationFiles.filter((m) => {
        return !storedMigrationIds.includes(convertFilename(m).timestamp);
    });

    const failedMigrations = migrationFiles.filter((m) => {
        return failedMigrationIds.includes(convertFilename(m).timestamp);
    });

    const migrationsToRun = [...newMigrations, ...failedMigrations];
    return migrationsToRun;
};