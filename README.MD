## generator-feather

![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg) [![CircleCI](https://circleci.com/gh/isobaraustralia/generator-feather.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/isobaraustralia/generator-feather) [![Build status](https://ci.appveyor.com/api/projects/status/4ds3pidr16ua7ijf/branch/master?svg=true)](https://ci.appveyor.com/project/isobaraustralia/generator-feather/branch/master) [![codecov](https://codecov.io/gh/isobaraustralia/generator-feather/branch/master/graph/badge.svg)](https://codecov.io/gh/isobaraustralia/generator-feather)

Yeoman project for setting up a modern build setup for [Sitefinity Feather](http://projectfeather.sitefinity.com/).

## Features

- [X] Webpack with support for SASS, ES5 with babel, Spritesmith and image optimization
- [X] Support for Bootstrap/Foundation/SemantecUi/Minimal Feather packages
- [ ] Support for previous version of sitefinity/feather
- [X] Webpack Dev Server with support for setting up inline hot reloading

## Requirements

- Sitefinity 9.2
- [NodeJS](https://nodejs.org/en/download/current/) 4 or later (6 Recommended)
- [Yarn](https://yarnpkg.com)
- [Yeoman](http://yeoman.io/) - `yarn global add yo`

## Where to install

It is assumed that you will be installing feather to `~/ResourcePackages`.

## Installing

You can being by simply typing `yo` and follow the prompts to install `feather`.

Or you run the following to first install it globally then start the install

```sh
yarn global add generator-feather
yo feather
```

Once you begin, you may choose which framework you want and which version of feather you want.

## Tasks

Once installed, you will now be able to use yarn to run your project's tasks.

- `yarn run build` - Uses webpack to compile out to `/assets`
- `yarn run build:dev` - Builds a development version to disk
- `yarn run dev`  - Starts up a local dev server for the project on http://localhost:8080/
- `yarn run lint` - Lint for code issues using eslint
- `yarn run lintfix` - Fix linting issues
- `yarn run test` - Built in mocha and unit tests to get you going

## Build System Explained

The build system is built around [Webpack](https://webpack.github.io/) and uses Yarn to manage your dependencies. By default all your code is contained in the `src/` folder and starts with `src/js/app.js` as it's entry point.

## More Information

If anything here is confusing or you have an issue, feel free to open an issue on github or check the wiki for help.
