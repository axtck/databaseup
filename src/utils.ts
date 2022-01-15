export const handleExceptionLazy = (e: unknown, message: string): void => {
    if (e instanceof Error) {
        console.log(warningText(`${message}: ${e.message}`));
    } else {
        console.log(warningText(`value thrown was not an error, ${message}: ${e}`));
    }
};

export const getCreateArgs = (): string[] => {
    const args = process.argv.slice(2);
    if (!args || !args.length) throw new Error("no args passed");
    if (args.length < 2) throw new Error("missing arg");
    if (args.length > 2) throw new Error("too many args passed");
    return args;
};

export const successText = (text: string) => {
    return `\x1b[32m${text}\x1b[0m`;
};

export const warningText = (text: string) => {
    return `\x1b[33m${text}\x1b[0m`;
};