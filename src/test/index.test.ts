import { run } from "../lib";

jest.spyOn(console, "log").mockImplementation(() => {
  // do nothing
});

test("should run", async () => {
  const mock = jest.spyOn(process, "exit").mockImplementation((n) => n);
  await run();
  expect(mock).toHaveBeenCalledWith(0);
});
