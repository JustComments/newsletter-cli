import chalk from "chalk";
import opn = require("opn");
import { ExistingNewsLetterCommand } from "./ExistingNewsletterCommand";

export class EditCommand extends ExistingNewsLetterCommand {
  public async run() {
    opn(this.newsletter.getFilePath());
    console.log(
      chalk.green(`= Opened ${this.newsletter.getFilePath()} in your editor`),
    );
  }
}
