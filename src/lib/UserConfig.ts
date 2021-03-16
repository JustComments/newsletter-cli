import fs = require("fs");
import os = require("os");

const homedir = os.homedir();
const configModule = `${homedir}/.newsletter-cli/config`;

export type Config = {
  template_subject?: unknown
  template_css?: unknown
  template_body?: unknown
  source_default?: unknown
  ses_send_configuration?: unknown
}

export class UserConfig {
  private _config: Config;
  constructor() {
    this._config = {};
    if (fs.existsSync(`${configModule}.js`)) {
      // tslint:disable:no-var-requires
      this._config = require(configModule);
    }
  }
  getTemplateSubject(): string | undefined {
    const templateSubject = this._config.template_subject as string | undefined;
    if (typeof templateSubject !== 'undefined' && typeof templateSubject !== 'string') {
       throw new Error("template_subject must be a string")
    }
    return templateSubject;
  }
  getTemplateCss(): string | undefined {
    const templateCss = this._config.template_css as string | undefined;
    if (typeof templateCss !== 'undefined' && templateCss && typeof templateCss !== 'string') {
       throw new Error("template_css must be a string")
    }
    return templateCss;
  }
  getTemplateBody(): string | undefined {
    const templateBody = this._config.template_body as string | undefined;
    if (typeof templateBody !== 'undefined' && typeof templateBody !== 'string') {
       throw new Error("template_body must be a string")
    }
    return templateBody;
  }
  getSourceDefault(): string | undefined {
    const sourceDefault = this._config.source_default as string | undefined;
    if (typeof sourceDefault !== 'undefined' && typeof sourceDefault !== 'string') {
       throw new Error("source_default must be a string")
    }
    return sourceDefault;
  }
  getSesSendConfiguration(): object | undefined {
    const sesSendConfiguration = this._config.ses_send_configuration as object | undefined;
    if (typeof sesSendConfiguration !== 'undefined' && typeof sesSendConfiguration !== 'object') {
       throw new Error("ses_send_configuration must be an object")
    }
    return sesSendConfiguration;
  }
};
