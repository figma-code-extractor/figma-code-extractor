# figma-code-extractor

This is used to generate components and code for shared design tokens based on a figma design library.

Currently it can generate `react` and `react-native` typescript code for icons.

## Table of contents

1. [Consuming this package](#1.-Consuming-this-package)
   - [Adding the package](#Adding-the-package)
     - [Github package registry scope](#Github-package-registry-scope)
     - [Installing](#Installing)
   - [Configuring your project](#Configuring-your-project)
   - [Generating components and code](#Generating-components-and-code)
2. [Development](#2.-Development)

## 1. Consuming this package

### Adding the package

#### Github package registry scope

This project is only published to the github registry, and requires you to add the following line to an `.npmrc` file at the top level of your project.

```rc
@figma-code-extractor:registry=https://npm.pkg.github.com
```

#### Installing

Currently this project is designed around consumers using its cli.

Once you've setup your project to allow installation from github registry, run the following to install the cli to your project.

```sh
yarn add @figma-code-extractor/cli
```

### Configuring your project

Add a [config file <sup>1</sup>](#config-file)</sup> at the top level of your project with the following settings.

```js
// figma-code-extractor.config.js
module.exports = {
  figma: {
    iconsFilePageUrl:
      'https://www.figma.com/file/FAKEID/PageName?node-id=000%3BAS000',
  },
  output: {
    frameworkType: 'react-native',
    folderPath: 'src/design',
  },
};
```

#### figma-code-extractor config options

```ts
type figmaCodeExtractorConfigOptions = {
  figma: {
    /** should be the url when you first navigate to a page in your figma file */
    iconsFilePageUrl: string;
  };
  output: {
    frameworkType: 'react-native' | 'react';
    /** folder path where code and components will be created */
    folderPath: 'src/generated/design';
  };
};
```

### Generating components and code

Quickest start is to grab a personal access token from your Figma account settings page.

Then running the following command will generate a new version of the design package locally.

```sh
figmaToken=personalAccessToken yarn run @figma-code-extractor/cli extract
```

This will output framework components and code to an output folder based on your config files `output.folderPath` value.

As part of generation, a `README.md` file is created in the output folder with the usage guidance for the generated components.

## 2. Development

Before working on an individual package, it's useful to do a `lerna bootstrap` and `lerna build`, see below for details.

### Bootstrap dependencies

```sh
yarn bootstrap
```

Install all our external package dependencies
Create a symlink between local package dependencies inside the relevant node_modules folder
Run npm prepare and prepublish inside all local packages

### Build TypeScript

```sh
yarn build
```

Builds all packages in sequence of dependency.

---

## References

<a id="config-file">1. config file</a>: This project loads config via [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) with a module name of `figma-code-extractor`
