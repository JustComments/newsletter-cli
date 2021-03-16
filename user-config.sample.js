const fs = require("fs");
const homedir = require("os").homedir();

const config_dir = `${homedir}/.newsletter-cli`;
const template_path = `${config_dir}/base_template.html`;
const style_path = `${config_dir}/style.css`;
const template_data = fs.readFileSync(template_path, {encoding:'utf8', flag:'r'}).toString();

const config = {}

/**
 * These customizations alter the output of the 'prepare' command.
 */
// Custom subject.
config.template_subject = "My custom subject line"
// Custom CSS style path.
config.template_css = style_path
// Custom body.
config.template_body = template_data;

/**
 * These customizations alter the output of the 'send' command.
 */
// Default source email.
config.source_default = "noreply@example.com"

/**
 * These customizations alter the SES transport.
 */
// Merge into request object for sending.
config.ses_send_configuration = {
  ConfigurationSetName: "bulk-send",
}

/***** END *****/
// Following lines are always needed.
var module = module || {};
module.exports = config;

// vi: ft=javascript
