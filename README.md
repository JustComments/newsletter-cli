<h1 align="center">
  newsletter-cli
  <a href="https://www.npmjs.org/package/newsletter-cli"><img src="https://img.shields.io/npm/v/newsletter-cli.svg?style=flat" alt="npm"></a>
</h1>
<p align="center">
  <img src="https://raw.githubusercontent.com/OrKoN/newsletter-cli/master/demo.svg" width="572" alt="newsletter cli demo">
</p>

*Write newsletters in Markdown and send to many recipients from your machine using AWS SES.*

## Prerequisites

Prepare your AWS SES account and configure access to AWS on your machine:

 - https://docs.aws.amazon.com/ses/latest/DeveloperGuide/sign-up-for-aws.html) 
 - https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html

## Getting Started

```sh
npm i newsletter-cli -g
```

- Step 1: Run `newsletter prepare` to get started. Follow the command's instructions.
- Step 2: Run `newsletter edit <newsletter-name>` to open the prepared markdown file for the newsletter using an editor. Write your newsletter!
- Step 3: Run `newsletter preview <newsletter-name>` to preview the resulting HTML of your newsletter in a web-browser.
- Step 4: Run `newsletter send <newsletter-name> <recipients-csv> <from-email>` to send the newsletter in bulks respecting the send rate of AWS SES.

## Parameters

- `<newsletter-name>` is the internal name for your newsletter (alphanumerical characters and `-`, `_` only). 
    The newsletter name defines the name of the local file where the newsletter source is stored. 
    <newsletter-name> is stored as <newsletter-name>.md
- `<recipients-csv>` is the path to a file containing recipients of the newsletter. 
    The file must be comma-separated (,) and must contain column headers in the first row. 
    The column named 'email' must be present in the file
- `<from-email>` is the email address which will appear as the sender of the newsletter.

## Get Help

[Open an issue](https://github.com/orkon/newsletter-cli/issues)
