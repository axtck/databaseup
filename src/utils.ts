import { ICreateArgs, IMigrationFileInfo } from "./types";
import minimist from "minimist";
import { Constants } from "./Constants";

export const handleExceptionLazy = (e: unknown, message: string): void => {
    if (e instanceof Error) {
        console.log(warningText(`${message}: ${e.message}`));
    } else {
        console.log(warningText(`value thrown was not an error, ${message}: ${e}`));
    }
};

export const getCreateArgs = (): ICreateArgs => {
    const { _: extra, name, src, driver } = minimist(process.argv.slice(2), {
        string: ["name", "src", "driver"]
    });

    if (extra && extra.length) {
        throw new Error(`parsing args failed: '${JSON.stringify(extra)}' ${extra.length > 1 ? "are invalid" : "is invalid"}`);
    }

    if (!/^[a-zA-Z0-9]+$/.test(name)) throw new Error("name has to meet /^[a-zA-Z0-9]+$/");
    if (!/^[a-zA-Z0-9/]+$/.test(src)) throw new Error("src folder has to meet /^[a-zA-Z0-9/]+$/");
    if (!Constants.databaseDrivers.includes(driver)) {
        throw new Error(`invalid driver, options are: ${Constants.databaseDrivers.join(", ").slice(0, -2)}`);
    }

    return {
        name: name,
        src: src,
        driver: driver
    };
};

export const convertFilename = (filename: string): IMigrationFileInfo => {
    const parts = filename.slice(0, -3).split(/_(.+)/).filter(x => x); // slice of extention and split on first _
    if (!parts || parts.length !== 2) throw new Error("migration filename invalid");
    if (isNaN(Number(parts[0]))) throw new Error("migration timestamp missing in filename");
    const info: IMigrationFileInfo = {
        timestamp: Number(parts[0]),
        name: parts[1]
    };
    return info;
};

export const successText = (text: string) => {
    return `\x1b[32m${text}\x1b[0m`;
};

export const warningText = (text: string) => {
    return `\x1b[33m${text}\x1b[0m`;
};