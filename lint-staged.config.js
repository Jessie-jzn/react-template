'use strict'
module.exports = {
  linters: {
    './src/*.ts': ['prettier --write', 'eslint --fix', 'git add'],
    './src/*.js': ['prettier --write', 'eslint --cache --fix', 'git add'],
    './src/*.vue': ['prettier --write', 'eslint --cache --fix', 'git add'],
    './src/*.{json,md,yml,css}': ['prettier --write', 'git add']
  }
}
