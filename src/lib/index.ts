import * as chalk from "chalk";
import * as figlet from "figlet";
import { EditCommand } from "./commands/EditCommand";
import { PrepareCommand } from "./commands/PrepareCommand";
import { PreviewCommand } from "./commands/PreviewCommand";
import { SendCommand } from "./commands/SendCommand";

export async function run() {
  const [, , command, name, recipientsCsv, source] = process.argv;

  try {
    switch (command) {
      case "prepare":
        await new PrepareCommand().run();
        break;

      case "preview":
        requireName(name);
        await new PreviewCommand(name).run();
        break;

      case "edit":
        requireName(name);
        await new EditCommand(name).run();
        break;

      case "send":
        requireName(name);
        requireRecipientsCsv(recipientsCsv);
        requireSource(source);
        await new SendCommand(name, recipientsCsv, source).run();
        break;

      case "help":
      case "":
      case undefined:
        help();
        break;

      default:
        console.log(
          chalk.red(
            `Unknown command ${command}. Run \`newsletter\` without arguments to see documenation.`,
          ),
        );
        process.exit(1);
    }
  } catch (err) {
    console.log(
      chalk.red(
        `Something went wrong: ${chalk.bold(
          err.message,
        )}. Run \`newsletter help\` to read documentation`,
      ),
    );
    process.exit(1);
  }

  process.exit(0);
}

function requireName(name?: string) {
  if (!name) {
    throw new Error("Newsletter name is required");
  }
}

function requireRecipientsCsv(recipientsCsv?: string) {
  if (!recipientsCsv) {
    throw new Error("Path to a CSV file with recipients is required");
  }
}

function requireSource(source?: string) {
  if (!source) {
    throw new Error("Sender's email address is required");
  }
}

function help() {
  /* tslint:disable:max-line-length */
  console.log(chalk.cyan(figlet.textSync("NewsletterCLI", {})));
  const c = chalk.white;
  const bc = chalk.bold.white;
  console.log(
    bc(
      "Write newsletters in Markdown and send to many recipients from your machine using AWS SES.",
    ),
  );
  console.log("");
  console.log(bc(`Prerequisites`));
  console.log("");
  console.log(
    c(
      "Prepare your AWS SES account and configure access to AWS on your machine: \n - https://docs.aws.amazon.com/ses/latest/DeveloperGuide/sign-up-for-aws.html) \n - https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html",
    ),
  );
  console.log("");
  console.log(bc("Getting Started"));
  console.log("");
  console.log(
    c(
      `${bc("Step 1")}: Run \`${bc(
        "newsletter prepare",
      )}\` to get started. Follow the command's instructions.`,
    ),
  );
  console.log(
    c(
      `${bc("Step 2")}: Run \`${bc(
        "newsletter edit <newsletter-name>",
      )}\` to open the prepared markdown file for the newsletter using an editor. Write your newsletter!`,
    ),
  );
  console.log(
    c(
      `${bc("Step 3")}: Run \`${bc(
        "newsletter preview <newsletter-name>",
      )}\` to preview the resulting HTML of your newsletter in a web-browser.`,
    ),
  );
  console.log(
    c(
      `${bc("Step 4")}: Run \`${bc(
        "newsletter send <newsletter-name> <recipients-csv> <from-email>",
      )}\` to send the newsletter in bulks respecting the send rate of AWS SES.`,
    ),
  );

  console.log("");

  console.log(bc("Parameters"));

  console.log("");

  console.log(
    bc("<newsletter-name>"),
    c(
      "is the internal name for your newsletter (alphanumerical characters and -, _ only).",
    ),
    c(
      "\n    The newsletter name defines the name of the local file where the newsletter source is stored.",
    ),
    c("\n    <newsletter-name> is stored as <newsletter-name>.md"),
  );

  console.log(
    bc("<recipients-csv>"),
    c("is the path to a file containing recipients of the newsletter."),
    c(
      "\n    The file must be comma-separated (,) and must contain column headers in the first row.",
    ),
    c("\n    The column named 'email' must be present in the file"),
  );

  console.log(
    bc("<from-email>"),
    c(
      "is the email address which will appear as the sender of the newsletter.",
    ),
  );

  console.log("");

  console.log(bc("Get Help"));

  console.log("");

  console.log(c("https://github.com/orkon/newsletter-cli/issues"));
}
