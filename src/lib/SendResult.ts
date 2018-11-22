export class SendResult {
  private statuses: IStatus[];
  private recipients: IRecipient[];

  constructor(statuses: IStatus[] = [], recipients: IRecipient[] = []) {
    this.statuses = statuses;
    this.recipients = recipients;
  }

  public count(): number {
    return this.recipients.length;
  }

  public failedCount(): number {
    return this.statuses.filter((s) => s.status !== "Success").length;
  }

  public merge(bulk: SendResult) {
    this.statuses = [...this.statuses, ...bulk.statuses];
    this.recipients = [...this.recipients, ...bulk.recipients];
  }

  public failed(): Array<{ recipient: IRecipient; status: IStatus }> {
    const combined = this.recipients.map((recipient, i) => {
      const status = this.statuses[i];
      if (!status) {
        throw new Error("Internal error: inconsistent state of bulk responses");
      }
      return {
        recipient,
        status,
      };
    });

    return combined.filter((c) => c.status.status !== "Success");
  }
}

interface IRecipient {
  getEmail(): string;
}

interface IStatus {
  error?: string;
  status?: string;
  messageId?: string;
}
