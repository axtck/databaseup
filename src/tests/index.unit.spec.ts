import { create } from "../create";
import { title } from "./../index";

describe("index", () => {
    it("should succeed", () => {
        expect(title).toEqual("dbup");
    });
});

describe("create", () => {
    const baseArgs = ["node", "script.js"]; // placeholders for argv [0] and [1]
    it("should succeed", async () => {
        process.argv = [...baseArgs, "testmigration", "src/tests"];
        await create();
    });
});