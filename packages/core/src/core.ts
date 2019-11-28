import * as Figma from 'figma-js';

import { Config } from '../../shared-types/src/sharedTypes';

import { getIcons } from './getIcons/getIcons';

export const loadFromFigma = async (config: Config) => {
  const client = Figma.Client({
    personalAccessToken: config.figmaToken,
  });

  await getIcons({
    client,
    framework: config.output.framework,
    iconsFilePageUrl: config.figma.iconsFilePageUrl,
    outputFolderPath: config.output.folderPath,
  });
};
