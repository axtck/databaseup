import { title } from "./../index";

describe("index", () => {
    it("should succeed", () => {
        expect(title).toEqual("dbup");
    });
});