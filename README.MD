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
- [NodeJS](https://nodejs.org/en/download/current/) 4 or later (6+ Recommended)
- [Yarn](https://yarnpkg.com) - For node module management and task running
- [Yeoman](http://yeoman.io/) `npm i -g yo`

## Where to install

It is assumed that you will be installing feather to `~/ResourcePackages` and that web.config can be found in the parent folder.

## Installing

Generator Feather can be added to yeoman by running the following command in your terminal:

```sh
npm i -g generator-feather
```

Once installed, you can begin bootstrapping/upgrading a repo by moving into `ResourcePackages/` in your terminal and running:

```sh
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

## Project Structure

The build system is built around [Webpack](https://webpack.github.io/) and uses Yarn to manage your dependencies. By default all your code is contained in the `src/` folder and starts with `src/js/app.js` as it's entry point.

```
assets/
  js/
    app.js
  css/
    styles.css
  img/
  fonts/
src/
  js/ - All your .js source code
    feather.js - Loads feather into your bundle, include the stylesheets
    app.js - Your javascript entry point
  sass/ - All .sass/.scss files go here
    feather.sass - Loads all feather modules for your chosen framework
    styles.sass - Your stylesheet entry point
  img/ - All source images will be compressed and copied to /assets/img/ on build
    favicon.png - Your favicon that will be used
  sprite/ - Contains images that are passed to spritesmith to generate a spritesheet with retina support
```

## Webpack Dev Server

The default template that is generated contains code to dynamically select which asset bundle to server. If you visit the site normally it will serve the compiled assets from the server like normal. However, if you are running webpack-dev-server (`yarn run dev`) then sitefinity will serve the bundle generated locally at `localhost:8080`.

While sitefinity is serving your local bundle, any changes you make to your source will be rebuilt and hot reloaded on the page automatically. This allows you to make any frontend changes (asside from changes to Views) and preview them without needing to refresh the page.

## More Information

If anything here is confusing or you have an issue, feel free to open an issue on github or check the wiki for help.