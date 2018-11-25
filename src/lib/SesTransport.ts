import * as aws from "aws-sdk";
import * as Handlebars from "handlebars";
import { SendResult } from "./SendResult";

process.env.AWS_SDK_LOAD_CONFIG = "1";

export class SesTransport {
  private ses: aws.SES;
  private templates: Handlebars.TemplateDelegate[];

  constructor() {
    this.ses = new aws.SES();
    this.templates = [];
  }

  public async getSendRate(): Promise<number> {
    const quota = await this.ses.getSendQuota().promise();
    if (!quota.MaxSendRate) {
      throw new Error("Cannot read quota.MaxSendRate");
    }
    return quota.MaxSendRate;
  }

  public async prepareTemplate(template: {
    html: string;
    text: string;
    subject: string;
    name: string;
  }): Promise<void> {
    const Template = {
      HtmlPart: template.html,
      SubjectPart: template.subject,
      TemplateName: template.name,
      TextPart: template.text,
    };
    this.templates.push(
      Handlebars.compile(template.subject, {
        strict: true,
      }),
    );
    this.templates.push(
      Handlebars.compile(template.text, {
        strict: true,
      }),
    );
    this.templates.push(
      Handlebars.compile(template.html, {
        strict: true,
      }),
    );
    try {
      await this.ses
        .createTemplate({
          Template,
        })
        .promise();
    } catch (err) {
      if (err.code !== "AlreadyExists") {
        throw err;
      }
      await this.ses
        .updateTemplate({
          Template,
        })
        .promise();
    }
  }

  public async send(
    source: string,
    recipients: IRecipient[],
    templateName: string,
  ) {
    try {
      const req = {
        DefaultTemplateData: "{}",
        Destinations: recipients.map((r) => {
          this.validateTemplate(r);
          return {
            Destination: {
              BccAddresses: [],
              CcAddresses: [],
              ToAddresses: [r.getEmail()],
            },
            ReplacementTemplateData: JSON.stringify(r.getVariables()),
          };
        }),
        Source: source,
        Template: templateName,
      };
      const result = await this.ses.sendBulkTemplatedEmail(req).promise();
      return new SendResult(
        result.Status.map((item) => {
          return {
            error: item.Error,
            messageId: item.MessageId,
            status: item.Status,
          };
        }),
        recipients,
      );
    } catch (err) {
      return new SendResult(
        recipients.map(() => {
          return {
            error: err,
            status: "SES Error",
          };
        }),
        recipients,
      );
    }
  }

  private validateTemplate(r: IRecipient) {
    try {
      for (const tmpl of this.templates) {
        tmpl(r.getVariables());
      }
    } catch (err) {
      throw err;
    }
  }
}

interface IRecipient {
  getEmail(): string;
  getVariables(): { [key: string]: any };
}
