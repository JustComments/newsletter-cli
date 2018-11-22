import { Newsletter } from "../Newsletter";

export class ExistingNewsLetterCommand {
  protected newsletter: Newsletter;
  constructor(name: string) {
    this.newsletter = new Newsletter(name);
    if (!this.newsletter.exists()) {
      throw new Error(
        `Newsletter with name ${this.newsletter.getName()} does not exist`,
      );
    }
  }
}
