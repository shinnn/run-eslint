'use strict';

const {inspect} = require('util');

const ansiRegex = require('ansi-regex');
const {CLIEngine} = require('eslint');
const inspectWithKind = require('inspect-with-kind');
const isPlainObject = require('lodash/isPlainObject');

const ARG_LENGTH_ERROR = 'Expected 1 or 2 argument (<string[]>[, <Object>])';
const PATHS_ERROR = 'Expected an array containing paths of files and/or directories to validate them with ESLint (<string[]>)';
const ansiReSource = ansiRegex().source;
const newlineReSource = '\\r?\\n';
const beginningNewlineRe = new RegExp(`^(?:${ansiReSource})*${newlineReSource}`, 'u');
const endNewlineRe = new RegExp(`${newlineReSource}(?:${ansiReSource})*$`, 'u');
const wrongOptionNames = new Set([
	'format',
	'formater',
	'formator',
	'formattor'
]);

function countFiles(count, {errorCount, warningCount}) {
	if (errorCount === 0 && warningCount === 0) {
		return count;
	}

	return count + 1;
}

function modifyError(err, code) {
	if (code) {
		err.code = code;
	}

	Error.captureStackTrace(err, runEslint);
	return err;
}

function runEslint(...args) {
	const argLen = args.length;
	const [paths, options = {}] = args;

	if (argLen === 0) {
		throw modifyError(new RangeError(`${ARG_LENGTH_ERROR}, but got no arguments.`), 'ERR_MISSING_ARGS');
	}

	if (argLen > 2) {
		throw modifyError(new RangeError(`${ARG_LENGTH_ERROR}, but got ${argLen} arguments.`), 'ERR_TOO_MANY_ARGS');
	}

	if (!Array.isArray(paths)) {
		throw modifyError(new TypeError(`${PATHS_ERROR}, but got a non-array value ${inspectWithKind(paths)}.`), 'ERR_INVALID_ARG_TYPE');
	}

	if (paths.length === 0) {
		throw modifyError(new Error(`${PATHS_ERROR}, but got [] (empty array).`), 'ERR_INVALID_ARG_VALUE');
	}

	for (const [index, path] of paths.entries()) {
		if (typeof path === 'string') {
			continue;
		}

		throw modifyError(new TypeError(`${PATHS_ERROR}, but the array includes a non-string value ${
			inspectWithKind(path)
		} at index ${index}.`));
	}

	if (argLen === 2) {
		if (!isPlainObject(options)) {
			throw modifyError(new TypeError(`Expected an <Object> to set ESLint CLIEngine's options, but got ${
				inspectWithKind(options)
			}.`), 'ERR_INVALID_ARG_TYPE');
		}

		if (options.fix !== undefined && typeof options.fix !== 'boolean') {
			throw modifyError(new TypeError(`Expected \`fix\` option to be a <boolean>, but got a non-boolean value ${
				inspectWithKind(options.fix)
			}.`), 'ERR_INVALID_OPT_VALUE');
		}

		if (options.formatter !== undefined) {
			if (typeof options.formatter !== 'string') {
				throw modifyError(new TypeError(`Expected \`formatter\` option to be a <string>, but got a non-string value ${
					inspectWithKind(options.formatter)
				}.`), 'ERR_INVALID_OPT_VALUE');
			}

			if (options.formatter.length === 0) {
				throw modifyError(new Error('Expected `formatter` option to be a formatter name or path, but got \'\' (empty string).'), 'ERR_INVALID_OPT_VALUE');
			}
		}

		for (const wrongOptionName of wrongOptionNames) {
			const value = options[wrongOptionName];

			if (value === undefined) {
				continue;
			}

			throw modifyError(new Error(`run-eslint doesn't support \`${wrongOptionName}\` option, but a value ${
				inspect(value)
			} was provided for it. Probably it's mistaken for \`formatter\` option.`));
		}
	}

	const cli = new CLIEngine(options);
	const format = options.formatter ? cli.getFormatter(options.formatter) : null;
	const report = cli.executeOnFiles(paths);

	if (options.fix) {
		CLIEngine.outputFixes(report);
	}

	if (report.errorCount === 0) {
		if (report.warningCount === 0) {
			return report;
		}

		const stdout = (format || cli.getFormatter())(report.results);

		if (stdout.match(endNewlineRe) === null) {
			console.log(stdout);
			return report;
		}

		process.stdout.write(stdout);
		return report;
	}

	const fileNum = report.results.reduce(countFiles, 0);
	const hasSingleProblem = report.errorCount + report.warningCount === 1;
	const stdout = (format || cli.getFormatter())(report.results);

	throw modifyError(new Error(`ESLint found ${hasSingleProblem ? 'a problem' : 'problems'} in ${
		fileNum === 1 ? 'a file' : `${fileNum} files`
	}.${stdout.match(beginningNewlineRe) === null ? '\n' : ''}
${stdout}${stdout.match(endNewlineRe) === null ? '\n' : ''}`));
}

module.exports = runEslint;
