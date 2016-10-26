## generator-feather

[![CircleCI](https://circleci.com/gh/Shard/generator-feather.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/Shard/generator-feather) [![codecov](https://codecov.io/gh/Shard/generator-feather/branch/master/graph/badge.svg)](https://codecov.io/gh/Shard/generator-feather)

Yeoman project for bootstrapping sitefinity feather.

## Requirements

- Sitefinity 9.2
- [NodeJS](https://nodejs.org/en/download/current/) 4 or later (6 Recommended)
- [Yarn](https://yarnpkg.com)
- [Webpack](https://webpack.github.io/) - `yarn global add webpack`

### Optional

- [Eslint](http://eslint.org/) - `yarn global add eslint`
- [Webpack Dev Server](https://webpack.github.io/docs/webpack-dev-server.html) - `yarn global add webpack webpack-dev-server`
- [Mocha](https://mochajs.org/) - `yarn global add eslint`

## Installing

```yarn global add generator-feather```

## Usage

Hop into your `ResourcePackages/` folder within Sitefinity and run `yo feather`

## Tasks

Yarn is used for running all the tasks:

- `yarn run build` - Builds the frontend back to `/assets`
- `yarn run dev`  - Starts up a local dev server for the project on http://localhost:8080/
- `yarn run lint` - Lint for code issues
- `yarn run lintfix` - Fix linting issues
- `yarn run test` - Built in mocha and unit tests to get you going
