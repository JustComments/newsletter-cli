import { Recipient } from "../../lib/Recipient";
import { Recipients } from "../../lib/Recipients";

test("create Recipient with valid email", () => {
  const result = new Recipient({
    email: "a@b.com",
  });
  expect(result.getEmail()).toMatchInlineSnapshot(`"a@b.com"`);
});

test("create Recipient with invalid email", () => {
  const test = () =>
    new Recipient({
      email: "test",
    });

  expect(test).toThrowErrorMatchingInlineSnapshot(
    `"Recipient test is not a valid email address"`,
  );
});

test("create Recipient with missing email", () => {
  const test = () =>
    new Recipient({
      missing: "test",
    });

  expect(test).toThrowErrorMatchingInlineSnapshot(
    `"Recipient {\\"missing\\":\\"test\\"} does not contain a column named \`email\`"`,
  );
});

test("create Recipients from valid CSV", () => {
  expect(new Recipients(`email\na@b.com`).count()).toMatchSnapshot();
  expect(
    new Recipients(`email\na@b.com\n\n\nc@d.com`).count(),
  ).toMatchSnapshot();
  expect(new Recipients(`email,smth\na@b.com,smth`).count()).toMatchSnapshot();
  expect(new Recipients(`email\r\na@b.com`).count()).toMatchSnapshot();
});

test("iterate recipients", () => {
  const r = new Recipients(
    [
      "email",
      ...Array(11)
        .fill(0)
        .map((_, i) => `${i}@test.com`),
    ].join("\n"),
  );
  expect(r.count()).toBe(11);
  expect(r.hasNext()).toBe(true);

  const next5 = r.next(5);
  expect(next5.length).toBe(5);
  expect(next5).toMatchInlineSnapshot(`
Array [
  Recipient {
    "email": "0@test.com",
  },
  Recipient {
    "email": "1@test.com",
  },
  Recipient {
    "email": "2@test.com",
  },
  Recipient {
    "email": "3@test.com",
  },
  Recipient {
    "email": "4@test.com",
  },
]
`);

  expect(r.hasNext()).toBe(true);
  const another5 = r.next(5);
  expect(another5.length).toBe(5);
  expect(another5).toMatchInlineSnapshot(`
Array [
  Recipient {
    "email": "5@test.com",
  },
  Recipient {
    "email": "6@test.com",
  },
  Recipient {
    "email": "7@test.com",
  },
  Recipient {
    "email": "8@test.com",
  },
  Recipient {
    "email": "9@test.com",
  },
]
`);

  expect(r.hasNext()).toBe(true);
  const another1 = r.next(5);
  expect(another1.length).toBe(1);
  expect(another1).toMatchInlineSnapshot(`
Array [
  Recipient {
    "email": "10@test.com",
  },
]
`);

  expect(r.hasNext()).toBe(false);
});
