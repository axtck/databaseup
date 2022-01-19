import { IMigrationFileInfo } from "./types";
export const handleExceptionLazy = (e: unknown, message: string): void => {
    if (e instanceof Error) {
        console.log(warningText(`${message}: ${e.message}`));
    } else {
        console.log(warningText(`value thrown was not an error, ${message}: ${e}`));
    }
};

export const getCreateArgs = (): { name: string, srcFolder: string; } => {
    const args = process.argv.slice(2);
    if (!args || !args.length) throw new Error("no args passed");
    if (args.length < 2) throw new Error("missing arg");
    if (args.length > 2) throw new Error("too many args passed");
    if (!/^[a-zA-Z0-9]+$/.test(args[0])) throw new Error("name has to meet /^[a-zA-Z0-9]+$/");
    if (!/^[a-zA-Z0-9/]+$/.test(args[1])) throw new Error("root folder has to meet /^[a-zA-Z0-9/]+$/");

    return {
        name: args[0],
        srcFolder: args[1]
    };
};

export const convertFilename = (filename: string): IMigrationFileInfo => {
    const parts = filename.slice(-3).split(/_(.+)/); // slice of extention and split on first _
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