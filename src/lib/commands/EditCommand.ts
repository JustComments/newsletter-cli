import * as chalk from "chalk";
import open = require("open");
import { ExistingNewsLetterCommand } from "./ExistingNewsletterCommand";

export class EditCommand extends ExistingNewsLetterCommand {
  public async run() {
    await open(this.newsletter.getFilePath());
    console.log(
      chalk.green(`= Opened ${this.newsletter.getFilePath()} in your editor`),
    );
  }
}
