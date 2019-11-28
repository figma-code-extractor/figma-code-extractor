export type SupportedFramework = 'react' | 'react-native';

export type Config = {
  figmaToken: string;
  figma: {
    iconsFilePageUrl: string;
    semanticColorsNodeUrl: string;
  };
  output: {
    framework: SupportedFramework;
    folderPath: string;
  };
};
