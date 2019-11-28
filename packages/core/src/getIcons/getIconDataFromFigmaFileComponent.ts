import { Node, ComponentMetadata } from 'figma-js';

export type IconData = ReturnType<typeof getIconDataFromFigmaFileComponent>;

export const getIconDataFromFigmaFileComponent = (
  iconFile: string,
  node: Node,
  componentsMetaData: {
    readonly [key: string]: ComponentMetadata;
  },
) => {
  const { name, id } = node;

  if (node.type !== 'COMPONENT') {
    throw new Error(`Encountered child of type ${node.type} when parsing icon file ${iconFile}.

Please ensure this page only contains components.`);
  }

  const { description = '', key } = componentsMetaData[node.id];
  const { width, height } = node.absoluteBoundingBox;

  return {
    name,
    id,
    key,
    description,
    width,
    height,
  };
};
