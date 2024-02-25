## Running locally
### Prerequisites
- Node.js 20.x runtime or later.
- TypeScript package installed globally.

### Starting application
- Download the source code using `git clone` or download as ZIP.
- Open the root directory of the project in a terminal.
- Run `npm i` to install all of the necessary dependencies.
- Create a file called `.env` in the root directory of the project.
- Choose a port for the webserver by adding `PORT=<some port>` to the file.
- If you would like to use Google ReCAPTCHA, add your client secret as `RECAPTCHA_SECRET=<secret>` or disable it with `DEV=true`.
- Run `npm start` to compile TypeScript and start the webserver.

### NPM Scripts
- `npm start` - Compiles TypeScript and starts the webserver.
- `npm run build` - Compiles TypeScript.
- `npm run test` - Generates reports from some sample evaluations for classification testing at `src/test/reports`.
