import opn = require("opn");
import { ExistingNewsLetterCommand } from "./ExistingNewsletterCommand";

export class EditCommand extends ExistingNewsLetterCommand {
  public async run() {
    opn(this.newsletter.getFilePath());
  }
}
