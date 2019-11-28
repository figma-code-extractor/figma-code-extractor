export const getFileAndNodeFromUrl = (figmaPageUrl: string) => {
  try {
    const file = figmaPageUrl.match(/file\/([a-z0-9]+)\//i)![1];

    const nodeId = decodeURIComponent(
      figmaPageUrl.match(/node-id=([a-zA-Z0-9\%]+)$/i)![1],
    );

    return { file, nodeId };
  } catch {
    throw new Error(`Unable to find page for url:

${figmaPageUrl}

This should be the url you land on when opening a page initially from a file in figma.

This config is loaded from \'design.config.json\`.`);
  }
};
