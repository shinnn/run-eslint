# run-eslint

[![npm version](https://img.shields.io/npm/v/run-eslint.svg)](https://www.npmjs.com/package/run-eslint)
[![Build Status](https://travis-ci.com/shinnn/run-eslint.svg?branch=master)](https://travis-ci.com/shinnn/run-eslint)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/run-eslint.svg)](https://coveralls.io/github/shinnn/run-eslint?branch=master)

Execute [ESLint](https://eslint.org/) with a simplified API

```javascript
const runEslint = require('run-eslint');

runEslint(['src/'], {
  fix: true,
  formatter: 'codeframe'
});
```

Without this module,

```javascript
const {CLIEngine} = require('eslint');

const cli = new CLIEngine({fix: true});
const report = cli.executeOnFiles(['src/']);
const messages = cli.getFormatter('codeframe')(report.results);

CLIEngine.outputFixes(report);

if (report.errorCount !== 0) {
  throw new Error(messages);
}

if (report.warningCount !== 0) {
  console.log(messages);
}
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install run-eslint
```

## API

```javascript
const runEslint = require('run-eslint');
```

### runEslint(*paths*[, *options*])

*paths*: `string[]` (file and/or directory paths, directly passed to [`CLIEngine#executeOnFiles()`](https://eslint.org/docs/developer-guide/nodejs-api#cliengineexecuteonfiles))  
*options*: `Object` ([`CLIEngine`](https://eslint.org/docs/developer-guide/nodejs-api#cliengine) options)  
Return: `Object` (return value of `CLIEngine#executeOnFiles()`)

It lints files, [fixes](https://eslint.org/docs/developer-guide/nodejs-api#cliengineoutputfixes) problems when `fix` option is `true`, throws an error with the [formatted](https://eslint.org/docs/user-guide/formatters/) messages.

```javascript
runEslint(['some', 'invalid', 'files']);
/* throws an Error: ESLint found problems in 2 files.

/Users/shinnn/invalid/a.js
1:1  error  Parsing error: Unexpected token }

/Users/shinnn/files/b.js
1:1  error  'v' is not defined  no-undef
2:2  error  Missing semicolon   semi

✖ 3 problems (3 errors, 0 warnings)
1 error and 0 warnings potentially fixable with the `--fix` option.
`*/
```

When every problem is a [`warn` level](instead of throwing an `Error`), it just print messages to the [stdout](https://nodejs.org/api/process.html#process_process_stdout) instead of throwing an `Error`.

### options.formatter

Type: `string` (a [built-in formatter](https://eslint.org/docs/user-guide/command-line-interface#-f---format) name or a path to a custom formatter)
Default: same as the [`CLIEngine#getFormatter()`](https://eslint.org/docs/developer-guide/nodejs-api#clienginegetformatter)'s default

Set the formatter used when reporting problems.

```javascript
runEslint((['source.js'], {
  rules: {
    'no-console': 'warn'
  }
});
/*
/Users/shinnn/source.js
  1:1  warning  Unexpected console statement  no-console

✖ 1 problem (0 errors, 1 warning)
*/

runEslint((['source.js'], {
  rules: {
    'no-console': 'warn'
  },
  formatter: 'codeframe'
});
/*
warning: Unexpected console statement (no-console) at source.js:1:1:
> 1 | console.log(1);
    | ^
  2 |


1 warning found.
*/
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
