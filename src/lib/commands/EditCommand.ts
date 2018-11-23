import opn = require("opn");
import { ExistingNewsLetterCommand } from "./ExistingNewsletterCommand";
import chalk from "chalk";

export class EditCommand extends ExistingNewsLetterCommand {
  public async run() {
    opn(this.newsletter.getFilePath());
    console.log(
      chalk.green(`= Opened ${this.newsletter.getFilePath()} in your editor`),
    );
  }
}
