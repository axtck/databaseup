import { DatabaseDriver } from "./types";

export class Constants {
    public static readonly databaseDrivers: DatabaseDriver[] = [DatabaseDriver.MySQL, DatabaseDriver.Postgres];
}