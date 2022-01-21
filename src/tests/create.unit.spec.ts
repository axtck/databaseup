import { create } from "../create";
import os from "os";

type Platform = "posix" | "windows";
const platform: Platform = os.platform() === "win32" ? "windows" : "posix";

describe("create", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const baseArgs = ["node", "script.js"]; // placeholders for argv [0] and [1]

    const reset = () => {
        consoleSpy.mockReset();
    };

    beforeEach(() => {
        reset();
    });

    it("should succeed", async () => {
        process.argv = [...baseArgs, "testmigration", "src/tests"]; // posix path
        await create();

        if (platform === "windows") {
            expect(consoleSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("successfully created migration"));
            expect(consoleSpy).toHaveBeenNthCalledWith(2, expect.stringContaining("src\\tests\\migrations"));
            expect(consoleSpy).toHaveBeenCalledTimes(2);
        } else {
            expect(consoleSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("successfully created migration"));
            expect(consoleSpy).toHaveBeenNthCalledWith(2, expect.stringContaining("src/tests/migrations"));
            expect(consoleSpy).toHaveBeenCalledTimes(2);
        }
    });

    it("should fail (no args)", async () => {
        process.argv = [...baseArgs];
        await create();
        expect(consoleSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("no args passed"));
        expect(consoleSpy).toHaveBeenCalledTimes(3);
    });

    it("should fail (too many args)", async () => {
        process.argv = [...baseArgs, "testmigration", "src/tests", "extra"];
        await create();
        expect(consoleSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("too many args passed"));
        expect(consoleSpy).toHaveBeenCalledTimes(3);
    });

    it("should fail (non meeting name)", async () => {
        process.argv = [...baseArgs, "test$migration", "src/tests"];
        await create();
        expect(consoleSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("name has to meet"));
        expect(consoleSpy).toHaveBeenCalledTimes(3);
    });

    it("should fail (non meeting root folder)", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        process.argv = [...baseArgs, "testmigration", "src/$tests"];
        await create();
        expect(consoleSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("root folder has to meet"));
        expect(consoleSpy).toHaveBeenCalledTimes(3);
    });
});