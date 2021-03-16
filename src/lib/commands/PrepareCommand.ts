import * as chalk from "chalk";
import * as inquirer from "inquirer";
import { Newsletter } from "../Newsletter";

export class PrepareCommand {
  public async run() {
    const question: inquirer.Question<IAnswer> = {
      default: "NEWSLETTER_NAME",
      filter: (input: string) => input.trim(),
      message: "Choose a name for your newsletter",
      name: "name",
      type: "input",
      validate: () => true,
    };
    const { name } = await inquirer.prompt([question]);
    const newsletter = new Newsletter(name);
    if (newsletter.exists()) {
      throw new Error(
        `Newsletter with name ${newsletter.getFilePath()} already exists`,
      );
    }
    newsletter.writeTemplate();
    console.log(
      chalk.green(
        `= Successully created ${newsletter.getFilePath()}. Start writing your newsletter!`,
      ),
    );
  }
}

interface IAnswer {
  name: string;
}
