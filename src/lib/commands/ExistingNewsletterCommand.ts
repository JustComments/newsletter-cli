import { Newsletter } from "../Newsletter";
import {UserConfig} from "../UserConfig";

export class ExistingNewsLetterCommand {
  protected newsletter: Newsletter;
  constructor(name: string, userConfig: UserConfig) {
    this.newsletter = new Newsletter(name, userConfig);
    if (!this.newsletter.exists()) {
      throw new Error(
        `Newsletter with name ${this.newsletter.getName()} does not exist`,
      );
    }
  }
}
