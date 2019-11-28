import { cosmiconfig } from 'cosmiconfig';
import { loadFromFigma } from '@figma-code-extractor/core';

export const extract = async (options: { verbose: boolean }) => {
  const explorer = cosmiconfig('figma-code-extractor');

  if (process.env.figmaToken === undefined) {
    const missingTokenError = `missing environment variable.

Cannot find environment variable figmaToken in process.

See the \`figma setup\` section in this repos top level README.md for more information.
`;

    throw Error(missingTokenError);
  }

  if (options.verbose) {
    console.info(`searching for figma-code-extractor config`);
  }

  const configResult = await explorer.search();

  if (configResult === null) {
    const noConfigFoundMessage = `Could not find figma-code-extractor config in any of the following places.

* a figma-code-extractor property in package.json
* a .figma-code-extractorrc file in JSON or YAML format
* a .figma-code-extractorrc.json file
* a .figma-code-extractorrc.yaml, .figma-code-extractorrc.yml, or .figma-code-extractorrc.js file
* a figma-code-extractor.config.js file exporting a JS object`;

    console.error(noConfigFoundMessage);
    process.exit(1);
  }

  if (options.verbose) {
    console.info(`config found in: ${configResult.filepath}`);
  }

  loadFromFigma({
    figmaToken: process.env.figmaToken,
    ...configResult.config,
  });
};
