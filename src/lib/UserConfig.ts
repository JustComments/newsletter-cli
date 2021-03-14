import fs = require("fs");
import os = require("os");

const homedir = os.homedir();
const configModule = `${homedir}/.newsletter-cli/config`;

export class UserConfig {
  public load() {
    let config = {};
    if (fs.existsSync(`${configModule}.js`)) {
      // tslint:disable:no-var-requires
      config = require(configModule);
    }
    return config;
  }
}
