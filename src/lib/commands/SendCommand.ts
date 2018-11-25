import chalk from "chalk";
import * as fs from "fs";
import * as inquirer from "inquirer";
import * as ismail from "isemail";
import Ora = require("ora");
import { Recipients } from "../Recipients";
import { Sender } from "../Sender";
import { SesTransport } from "../SesTransport";
import { ExistingNewsLetterCommand } from "./ExistingNewsletterCommand";

export class SendCommand extends ExistingNewsLetterCommand {
  private sender: Sender;
  private recipients: Recipients;
  private source: string;
  private recipientsCsv: string;

  constructor(name: string, recipientsCsv: string, source: string) {
    super(name);
    this.recipientsCsv = recipientsCsv;
    this.sender = new Sender(this.newsletter, new SesTransport());
    this.recipients = new Recipients(this.readCsvFile());
    this.source = source;
    this.validateSource();
  }

  public async run() {
    if (await this.ready()) {
      const spinner = new Ora({
        color: "green",
        text: `Sending emails 0/${this.recipients.count()}`,
      }).start();
      const result = await this.sender.send(
        this.source,
        this.recipients,
        (sent) => {
          spinner.text = `Sending emails ${sent}/${this.recipients.count()}`;
        },
      );
      spinner.stop();
      if (result.failedCount() === 0) {
        console.log(
          chalk.green(`= Successfully sent ${result.count()} emails`),
        );
      } else {
        console.log(
          chalk.red(
            `= ${result.failedCount()} emails have not been sent due to errors`,
          ),
        );

        for (const { recipient, status } of result.failed()) {
          console.log(
            chalk.red(
              `- ${recipient.getEmail()} ${status.status} ${status.error}`,
            ),
          );
        }
      }
    }
  }

  private async ready() {
    const message = [
      `Are you ready to send the newsletter "${this.newsletter.getName()}"`,
      `to ${this.recipients.count()} recipients from the file "${
        this.recipientsCsv
      }"`,
      `as ${this.source}`,
      `with max sending rate of ${await this.sender.getSendRate()} emails/second?`,
    ].join(" ");
    const question: inquirer.Question<IAnswer> = {
      default: false,
      message,
      name: "ready",
      type: "confirm",
    };
    const { ready } = await inquirer.prompt(question);
    return ready;
  }

  private validateSource() {
    if (!ismail.validate(this.source)) {
      throw new Error(`Sender's email address "${this.source}: is not valid`);
    }
  }

  private readCsvFile() {
    if (!fs.existsSync(this.recipientsCsv)) {
      throw new Error(
        `CSV file with recipients ${this.recipientsCsv} does not exist`,
      );
    }
    return fs.readFileSync(this.recipientsCsv, "utf8");
  }
}

interface IAnswer {
  ready: boolean;
}
