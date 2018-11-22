import { SendResult } from "./SendResult";

export class Sender {
  private newsletter: INewsletter;
  private transport: ITransport;

  constructor(newsletter: INewsletter, transport: ITransport) {
    this.newsletter = newsletter;
    this.transport = transport;
  }

  public async send(
    source: string,
    recipients: IRecipients,
    progress: ProgressFn,
  ) {
    await this.transport.prepareTemplate({
      ...this.newsletter.read(),
      name: this.getTemplateName(),
    });
    const sendRate = await this.getSendRate();
    const results = new SendResult();
    while (recipients.hasNext()) {
      const batch = recipients.next(sendRate);
      const result = await this.transport.send(
        source,
        batch,
        this.getTemplateName(),
      );
      results.merge(result);
      progress(results.count());
      await sleep(1500);
    }
    return results;
  }

  public async getSendRate(): Promise<number> {
    return await this.transport.getSendRate();
  }

  private getTemplateName() {
    return `newsletterCli-` + this.newsletter.getName();
  }
}

interface IRecipient {
  getEmail(): string;
}

interface IRecipients {
  hasNext(): boolean;
  next(n: number): IRecipient[];
}

interface INewsletter {
  getName(): string;
  read(): {
    html: string;
    text: string;
    subject: string;
  };
}

interface ITransport {
  prepareTemplate(template: {
    name: string;
    html: string;
    text: string;
    subject: string;
  }): Promise<void>;

  getSendRate(): Promise<number>;

  send(
    source: string,
    recipients: IRecipient[],
    templateName: string,
  ): Promise<SendResult>;
}

type ProgressFn = (sent: number) => void;

async function sleep(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

interface IRecipient {
  getEmail(): string;
}
