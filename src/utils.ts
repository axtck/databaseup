export const handleExceptionLazy = (e: unknown, message: string): void => {
    if (e instanceof Error) {
        console.log(`${message}: ${e.message}`);
    } else {
        console.log(`value thrown was not an error, ${message}: ${e}`);
    }
};

export const getMigrationNameFromArgv = (): string => {
    const args = process.argv.slice(2);
    if (!args || !args.length) throw new Error("no migration name arg passed");
    if (args.length > 1) throw new Error("only one arg can be passed");
    return args[0];
};