import fm = require("front-matter");
import * as fs from "fs";
import juice = require("juice");
import * as marked from "marked";
import rmm = require("remove-markdown");
import { UserConfig } from "./UserConfig";
const userConfigObj: UserConfig = new UserConfig();
const userConfig: any = userConfigObj.load();

type FrontMatter = typeof fm.default;

export class Newsletter {
  private name: string;
  private filePath: string;

  constructor(name: string) {
    this.validateName(name);
    this.name = name;
    this.filePath = this.resolveFilePath(name);
  }

  public exists() {
    return fs.existsSync(this.filePath);
  }

  public read(): {
    html: string;
    subject: string;
    text: string;
  } {
    const markdown = fs.readFileSync(this.filePath, "utf8");
    const { body, attributes } = ((fm as any) as FrontMatter)<IFrontMatterAttributes>(markdown);
    const { subject, styles } = attributes;
    const css = styles ? fs.readFileSync(styles, "utf8") : "";
    const html = `<html>
      <head>
        <title>${subject}</title>
        <style>${css}</style>
      </head>
      <body class="markdown-body">${marked(body)}
      </body>
    </html>`;
    const inlinedHtml = juice(html);
    return {
      html: inlinedHtml.trim(),
      subject: subject.trim(),
      text: rmm(body).trim(),
    };
  }

  public writeTemplate() {
    const subject = userConfig.template_subject ? userConfig.template_subject : "Subject of your awesome newsletter!";
    const styles = userConfig.template_css ? userConfig.template_css : require.resolve("github-markdown-css");
    const body = userConfig.template_body ? userConfig.template_body : `Hi {{name}}!

Here goes the text of your awesome newsletter!`;

    fs.writeFileSync(
      this.filePath,
      `---
subject: ${subject}
styles: ${styles}
---

${body}
`,
      "utf8",
    );
  }

  public getFilePath() {
    return this.filePath;
  }

  public getName() {
    return this.name;
  }

  private validateName(name: string) {
    if (!name.match("^[a-zA-Z0-9_-]+$")) {
      throw new Error(
        "Newsletter name can include only alphanumerical characters, _ and -",
      );
    }
  }

  private resolveFilePath(name: string): string {
    if (!name.endsWith(".md")) {
      return name + ".md";
    }
    return name;
  }
}

interface IFrontMatterAttributes {
  subject: string;
  styles?: string;
}
