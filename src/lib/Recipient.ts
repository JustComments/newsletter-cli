import * as ismail from "isemail";

export class Recipient {
  private raw: { [key: string]: any };

  constructor(raw: { [key: string]: any }) {
    this.raw = raw;
    this.validateEmail();
  }

  public getEmail() {
    return this.raw.email;
  }

  public getVariables() {
    return this.raw;
  }

  private validateEmail() {
    const { email } = this.raw;
    if (!email) {
      throw new Error(
        `Recipient ${JSON.stringify(
          this.raw,
        )} does not contain a column named \`email\``,
      );
    }
    if (!ismail.validate(email)) {
      throw new Error(`Recipient ${email} is not a valid email address`);
    }
  }
}
