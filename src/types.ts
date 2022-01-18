import mysql from "mysql2";

export interface IMigrationFile {
    upgrade: (connection: mysql.Connection) => Promise<void>;
}