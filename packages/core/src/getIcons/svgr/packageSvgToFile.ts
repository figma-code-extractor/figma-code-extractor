import { resolve } from 'path';
import { promises as fsPromises } from 'fs';

import { SupportedFramework } from '../../../../shared-types/src/sharedTypes';

import { IconData } from '../getIconDataFromFigmaFileComponent';
import {
  typescriptReactNativeTemplate,
  typescriptReactTemplate,
} from './typescriptTemplate';

const svgr = require('@svgr/core').default;

export const nodeToComponentName = (nodeName: string) => {
  return String(nodeName)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '$')
    .replace(/[^A-Za-z0-9]+/g, '$')
    .replace(/([a-z])([A-Z])/g, (_m, a, b) => a + '$' + b)
    .toLowerCase()
    .replace(/(\$)(\w?)/g, (_m, _a, b) => b.toUpperCase());
};

const getTemplate = (framework: SupportedFramework) => {
  switch (framework) {
    case 'react': {
      return {
        template: typescriptReactTemplate,
        customSvgrConfig: {},
      };
    }
    case 'react-native': {
      return {
        template: typescriptReactNativeTemplate,
        customSvgrConfig: {
          native: true,
        },
      };
    }
  }
};

export const packageSvgToFile = async (
  framework: SupportedFramework,
  images: [string, string][],
  componentsData: {
    [key: string]: IconData;
  },
  outputPath: string,
) => {
  const { template, customSvgrConfig } = getTemplate(framework);
  const reactSvgImages = await Promise.all(
    images.map(async image => {
      const [imageId, imageFileText] = image;

      return [
        imageId,
        await svgr(
          imageFileText,
          {
            ...customSvgrConfig,
            prettier: true,
            template: template,
            plugins: [
              '@svgr/plugin-svgo',
              '@svgr/plugin-jsx',
              '@svgr/plugin-prettier',
            ],
            replaceAttrValues: { '#26282D': '{props.color}' },
            svgoConfig: {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          },
          {
            componentName: nodeToComponentName(componentsData[imageId].name),
          },
        ),
      ];
    }),
  );

  await fsPromises.mkdir(outputPath, { recursive: true });

  await Promise.all(
    reactSvgImages.map(async reactSvgImage => {
      const [imageId, reactSvgText] = reactSvgImage;

      const fileName = `${nodeToComponentName(
        componentsData[imageId].name,
      )}.tsx`;
      const path = resolve(outputPath, fileName);

      await fsPromises.writeFile(path, reactSvgText);
    }),
  );
};
