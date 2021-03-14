import { SendCommand } from "../../../lib/commands/SendCommand";

test("should extract email address when only email address provided", () => {
  expect(SendCommand.extractEmail("a@b.com")).toEqual("a@b.com");
});

test("should extract email address only when full address provided", () => {
  expect(SendCommand.extractEmail(`"AB" <a@b.com>`)).toEqual("a@b.com");
});
