import { ClientInterface } from 'figma-js';
import fetch from 'node-fetch';
import { resolve } from 'path';
import { promises as fsPromises } from 'fs';

import { SupportedFramework } from '../../../shared-types/src/sharedTypes';

import { getFileAndNodeFromUrl } from '../lib/getFileAndNodeFromUrl';
import {
  getIconDataFromFigmaFileComponent,
  IconData,
} from './getIconDataFromFigmaFileComponent';
import { packageSvgToFile, nodeToComponentName } from './svgr/packageSvgToFile';

const missingIconsError = (
  filePath: string,
) => `Cannot find icons page from icons url provided:

${filePath}

This should be the url you land on when opening a page initially from a file in figma.

See the config setting \`iconsFilePageUrl\` in the projects README.md for details on how to set this.
`;

export const getIcons = async (options: {
  client: ClientInterface;
  framework: SupportedFramework;
  iconsFilePageUrl: string;
  outputFolderPath: string;
}) => {
  const { file: iconsFile, nodeId: iconsNodeId } = getFileAndNodeFromUrl(
    options.iconsFilePageUrl,
  );

  const response = await options.client.file(iconsFile);

  const iconsNode = response.data.document.children.find(pageNode => {
    return pageNode.id === iconsNodeId;
  });

  if (iconsNode === undefined || iconsNode.type !== 'CANVAS') {
    throw Error(missingIconsError(options.iconsFilePageUrl));
  }

  const componentsData = Object.values(iconsNode.children).reduce<{
    [key: string]: IconData;
  }>((acc, currentValue) => {
    const componentData = getIconDataFromFigmaFileComponent(
      options.iconsFilePageUrl,
      currentValue,
      response.data.components,
    );

    return {
      ...acc,
      [componentData.id]: componentData,
    };
  }, {});

  const fileImages = (
    await options.client.fileImages(iconsFile, {
      ids: Object.keys(componentsData),
      format: 'svg',
      svg_simplify_stroke: true,
    })
  ).data.images;

  const images: [
    /** componentId */ string,
    /** svg as text */ string,
  ][] = await Promise.all(
    Object.entries(fileImages).map(async entry => {
      const [imageId, imageUrl] = entry;

      return fetch(imageUrl, {
        headers: {
          'Content-Type': 'image/svg+xml',
          encoding: 'utf8',
        },
      }).then(
        async (response): Promise<[string, string]> => [
          imageId,
          await response.text(),
        ],
      );
    }),
  );

  const generatedIconsFolder = resolve(options.outputFolderPath, 'icons');

  await packageSvgToFile(
    options.framework,
    images,
    componentsData,
    generatedIconsFolder,
  );

  /**
   * Create static svgs in output folder, this is mostly useful for the generated documentation.
   *
   * For consideration: Might be worth enabling this behind a cli flag.
   */

  const generatedSvgFolder = resolve(
    __dirname,
    '..',
    '..',
    'generated',
    'assets/svg',
  );

  await fsPromises.mkdir(generatedSvgFolder, { recursive: true });
  await Promise.all(
    images.map(async image => {
      const [imageId, svgText] = image;
      const fileName = `${nodeToComponentName(
        componentsData[imageId].name,
      )}.svg`;

      const path = resolve(generatedSvgFolder, fileName);

      await fsPromises.writeFile(path, svgText);
    }),
  );

  /**
   * Create documentation file output folder.
   *
   * For consideration: Might be worth enabling this behind a cli flag along with the svg generation.
   */

  const generatedReadmeFolder = resolve(__dirname, '..', '..', 'generated');
  const path = resolve(generatedReadmeFolder, 'IconsREADME.md');

  const iconRows = images.map(image => {
    const [imageId] = image;
    const svgImageMarkdown = `![](./assets/svg/${nodeToComponentName(
      componentsData[imageId].name,
    )}.svg)`;
    const imageName = componentsData[imageId].name;
    const componentName = nodeToComponentName(componentsData[imageId].name);
    const usageCode = `<pre><code>import { ${nodeToComponentName(
      componentsData[imageId].name,
    )} } from '@kantan-design/native/icons/${componentName}';<br /><br />\\<${nodeToComponentName(
      componentsData[imageId].name,
    )} /></code></pre>`;

    return `| ${svgImageMarkdown} | ${imageName} | ${usageCode} |`;
  });

  const IconsREADME = `
# @kantan-design Icons

## Consuming icons

\`\`\`ts
import { ArrowLeft } from '@kantan-design/native/icons/ArrowLeft';

<ArrowLeft />;
\`\`\`

## Icons

| Image | Name | Usage  |
|---|---|---|
${iconRows.join('\n')}

`;

  await fsPromises.writeFile(path, IconsREADME);
};
