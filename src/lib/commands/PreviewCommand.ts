import chalk from "chalk";
import * as fs from "fs";
import opn = require("opn");
import * as os from "os";
import * as path from "path";
import { ExistingNewsLetterCommand } from "./ExistingNewsletterCommand";

export class PreviewCommand extends ExistingNewsLetterCommand {
  public async run() {
    const previewFilePath = await this.createPreviewFile();
    opn(previewFilePath);
    console.log(
      chalk.green(`= Opened ${this.newsletter.getFilePath()} in your browser`),
    );
  }

  private async createPreviewFile() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "preview"));
    const previewFilePath = path.join(dir, this.newsletter.getName() + ".html");
    const { html } = this.newsletter.read();
    fs.writeFileSync(previewFilePath, html, "utf8");
    return previewFilePath;
  }
}
