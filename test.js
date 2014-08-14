'use strict';

const {join} = require('path');
const {writeFile, unlink} = require('fs').promises;

const runEslint = require('.');
const test = require('tape');

function captureStdout() {
	const originalWrite = process.stdout.write.bind(process.stdout);
	const obj = {};

	process.stdout.write = function write(stdout) {
		obj.data = stdout;
		process.stdout.write = originalWrite;
	};

	return obj;
}

test('runEslint()', async t => {
	const paths = [join(__dirname, 'a.js'), join(__dirname, 'b.js')];

	await Promise.all([
		writeFile(paths[0], 'console.log(1) ;\n'),
		writeFile(paths[1], 'const unusedVar = console.log(1);\n\n')
	]);

	t.doesNotThrow(
		() => runEslint([__filename]),
		'should throw no errors when there is no ESLint problems.'
	);

	t.throws(
		() => runEslint([paths[0]]),
		/found a problem in a file\.[\s\S]*1 error and 0 warnings potentially fixable with the `--fix` option/um,
		'should include formatted ESLint messages to the error.'
	);

	t.throws(
		() => runEslint([...paths, __filename], {
			formatter: 'codeframe',
			rules: {
				'no-unused-vars': 'warn'
			}
		}),
		/found problems in 2 files\.[\s\S]*semi-spacing[\s\S]*no-unused-vars[\s\S]*no-multiple-empty-lines[\s\S]*/u,
		'should use a formatter specified in `formatter` option.'
	);

	const captured = captureStdout();

	runEslint(paths, {
		fix: true,
		rules: {
			'no-unused-vars': 'WARN'
		}
	});

	t.ok(
		captured.data,
		'should print warnings when there is no errors but warnings.'
	);

	const anotherCaptured = captureStdout();

	runEslint(paths, {
		formatter: require.resolve('eslint/lib/formatters/codeframe.js'),
		rules: {
			'no-unused-vars': 1
		}
	});

	t.ok(
		anotherCaptured.data,
		'should support path of a formatter.'
	);

	await Promise.all([unlink(paths[0]), unlink(paths[1])]);
	t.end();
});

test('Argument validation', t => {
	t.throws(
		() => runEslint(-0),
		/^TypeError.*Expected an array containing paths of files and\/or directories to validate them with ESLint \(<string\[\]>\), but got a non-array value -0 \(number\)\./u,
		'should throw an error when the first argument is not an array.'
	);

	t.throws(
		() => runEslint([]),
		/, but got \[\] \(empty array\)\./u,
		'should throw an error when the first argument is an empty array.'
	);

	t.throws(
		() => runEslint(['.', new Int32Array()]),
		/, but the array includes a non-string value Int32Array \[\] at index 1\./u,
		'should throw an error when the first argument includes a non-string value.'
	);

	t.throws(
		() => runEslint(['.'], new Set()),
		/^TypeError.*Expected an <Object> to set ESLint CLIEngine's options, but got Set \{\}\./u,
		'should throw an error when the second argument is not a plain object.'
	);

	t.throws(
		() => runEslint(['.'], {fix: Buffer.from('1')}),
		/^TypeError.*Expected `fix` option to be a <boolean>, but got a non-boolean value <Buffer 31>\./u,
		'should throw an error when `fix` option is not boolean.'
	);

	t.throws(
		() => runEslint(['.'], {formatter: new Map()}),
		/^TypeError.*Expected `formatter` option to be a <string>, but got a non-string value Map \{\}\./u,
		'should throw an error when `formatter` option is not a string.'
	);

	t.throws(
		() => runEslint(['.'], {formatter: ''}),
		/^Error.*Expected `formatter` option to be a formatter name or path, but got '' \(empty string\)\./u,
		'should throw an error when `formatter` option is an empty string.'
	);

	t.throws(
		() => runEslint(['.'], {format: 'json'}),
		/run-eslint doesn't support `format` option, but a value 'json' was provided for it\. Probably it's mistaken for `formatter` option\./u,
		'should throw an error when an unknown option is provided.'
	);

	t.throws(
		() => runEslint(),
		/^RangeError.*Expected 1 or 2 argument \(<string\[\]>\[, <Object>\]\), but got no arguments\./u,
		'should fail when it takes no arguments.'
	);

	t.throws(
		() => runEslint(['.'], {}, {}),
		/^RangeError.*Expected 1 or 2 argument \(<string\[\]>\[, <Object>\]\), but got 3 arguments\./u,
		'should fail when it takes too many arguments.'
	);

	t.end();
});
