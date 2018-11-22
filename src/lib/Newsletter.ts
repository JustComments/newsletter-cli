import * as fm from "front-matter";
import * as fs from "fs";
import * as marked from "marked";

import rmm = require("remove-markdown");

interface IFrontMatterAttributes {
  subject: string;
}

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
    const { body, attributes } = fm<IFrontMatterAttributes>(markdown);
    const html = `<title>${attributes.subject}</title>` + marked(body);
    return {
      html: html.trim(),
      subject: attributes.subject.trim(),
      text: rmm(body).trim(),
    };
  }

  public writeTemplate() {
    fs.writeFileSync(
      this.filePath,
      `---
subject: Define your subject here
---

Write your newsletter in Markdown here
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
