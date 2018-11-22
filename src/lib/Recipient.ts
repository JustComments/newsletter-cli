import * as ismail from "isemail";

export class Recipient {
  private email: string;
  constructor(raw: { [key: string]: any }) {
    this.email = raw.email;
    if (!this.email) {
      throw new Error(
        `Recipient ${JSON.stringify(
          raw,
        )} does not contain a column named \`email\``,
      );
    }
    if (!ismail.validate(this.email)) {
      throw new Error(`Recipient ${this.email} is not a valid email address`);
    }
  }
  public getEmail() {
    return this.email;
  }
}
