import mysql, { OkPacket, RowDataPacket } from "mysql2/promise";

export interface IMigrationFile {
    upgrade: (connection: mysql.Connection) => Promise<void>;
}

export interface IMigrationFileInfo {
    timestamp: number;
    name: string;
}

export enum CreatedStatus {
    Created, Exists, Failed
}

export type DbDefaults = RowDataPacket[] | RowDataPacket[][] | OkPacket[] | OkPacket;
export type DbQueryResult<T> = T & DbDefaults;