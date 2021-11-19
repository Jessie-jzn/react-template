'use strict'
module.exports = {
  ignore: ['package-lock.json', 'CHANGELOG.md'],
  linters: {
    '*.ts': ['prettier --write', 'eslint --fix', 'git add'],
    '*.js': ['prettier --write', 'eslint --cache --fix', 'git add'],
    '*.vue': ['prettier --write', 'eslint --cache --fix', 'git add'],
    '*.{json,md,yml,css}': ['prettier --write', 'git add']
  }
}
