import { Recipients } from "../../lib/Recipients";
import { Sender } from "../../lib/Sender";
import { SendResult } from "../../lib/SendResult";

test("send an email successfully", async () => {
  const sender = new Sender(
    makeTestNewsletter(),
    makeTestTransport(
      async (
        source: string,
        recipients: any[],
        templateName: string,
      ): Promise<SendResult> => {
        expect(source).toMatchSnapshot();
        expect(recipients).toMatchSnapshot();
        expect(templateName).toMatchSnapshot();
        return new SendResult(
          [
            {
              messageId: "test",
              status: "Success",
            },
          ],
          recipients,
        );
      },
    ),
  );
  const result = await sender.send(
    "a@b.com",
    new Recipients(`email\na@b.com`),
    (sent) => {
      expect(sent).toMatchSnapshot();
    },
  );
  expect(result.failedCount()).toMatchSnapshot();
});

test("send an email unsuccessfully", async () => {
  const sender = new Sender(
    makeTestNewsletter(),
    makeTestTransport(
      async (
        source: string,
        recipients: any[],
        templateName: string,
      ): Promise<SendResult> => {
        expect(source).toMatchSnapshot();
        expect(recipients).toMatchSnapshot();
        expect(templateName).toMatchSnapshot();
        return new SendResult(
          [
            {
              messageId: "test",
              status: "Failure",
            },
          ],
          recipients,
        );
      },
    ),
  );
  const result = await sender.send(
    "a@b.com",
    new Recipients(`email\na@b.com`),
    (sent) => {
      expect(sent).toMatchSnapshot();
    },
  );
  expect(result.failedCount()).toMatchSnapshot();
});

test("send many emails", async () => {
  const sender = new Sender(
    makeTestNewsletter(),
    makeTestTransport(
      async (
        source: string,
        recipients: any[],
        templateName: string,
      ): Promise<SendResult> => {
        expect(source).toMatchSnapshot();
        expect(recipients).toMatchSnapshot();
        expect(templateName).toMatchSnapshot();
        return new SendResult(
          recipients.map(() => {
            return {
              messageId: "test",
              status: "Success",
            };
          }),
          recipients,
        );
      },
    ),
  );
  const result = await sender.send(
    "a@b.com",
    new Recipients(
      [
        "email",
        ...Array(11)
          .fill(0)
          .map((_, i) => `${i}@test.com`),
      ].join("\n"),
    ),
    (sent) => {
      expect(sent).toMatchSnapshot();
    },
  );
  expect(result.failedCount()).toMatchSnapshot();
});

function makeTestNewsletter() {
  return {
    getName(): string {
      return "test";
    },
    read(): {
      html: string;
      subject: string;
      text: string;
    } {
      return {
        html: "test",
        subject: "test",
        text: "test",
      };
    },
  };
}

function makeTestTransport(
  send: (
    source: string,
    recipients: any[],
    templateName: string,
  ) => Promise<SendResult>,
) {
  return {
    async prepareTemplate(template: {
      name: string;
      html: string;
      text: string;
      subject: string;
    }): Promise<void> {
      expect(template).toMatchSnapshot();
    },
    async getSendRate(): Promise<number> {
      return 10;
    },
    send,
  };
}
