import { IMigrationFileInfo } from "../types";
import { convertFilename, parseArgv } from "../utils";

describe("utils", () => {
    describe("convertFilename", () => {
        it("should succeed", () => {
            const filename: string = "1642708136717_testmigration.ts";
            const converted = convertFilename(filename);
            const expected: IMigrationFileInfo = {
                timestamp: 1642708136717,
                name: "testmigration"
            };
            expect(converted).toStrictEqual(expected);
        });
        it("should fail (invalid)", () => {
            const filename: string = "16427abc36717_.ts";
            expect(() => convertFilename(filename)).toThrow(/migration filename invalid/);
        });
        it("should fail (no timestamp)", () => {
            const filename: string = "16427abc36717_testmigration.ts";
            expect(() => convertFilename(filename)).toThrow(/migration timestamp missing/);
        });
    });
    describe("getCreateArgs", () => {
        const baseArgs = ["node", "script.js"]; // placeholders for argv [0] and [1]
        it("should fail (extra args)", () => {
            process.argv = [...baseArgs, "--name", "testmigration", "--src", "src/tests", "something else"]; // posix path
            expect(() => parseArgv()).toThrow(/parsing args failed/);
        });
    });
});
