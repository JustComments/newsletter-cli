import * as csvparse from "csv-parse/lib/sync";
import { Recipient } from "./Recipient";

export class Recipients {
  private data: string;
  private recipients: Recipient[];
  private cursor: number;

  constructor(data: string) {
    this.data = data;
    this.recipients = this.parseRecipients();
    this.cursor = 0;
  }

  public hasNext(): boolean {
    return this.cursor < this.count();
  }

  public next(n: number): Recipient[] {
    const slice = this.recipients.slice(this.cursor, this.cursor + n);
    this.cursor += n;
    return slice;
  }

  public parseRecipients() {
    const rawRecipients = csvparse(this.data, {
      columns: true,
      skip_empty_lines: true,
    });
    return rawRecipients.map((r: any) => new Recipient(r));
  }

  public count() {
    return this.recipients.length;
  }
}
