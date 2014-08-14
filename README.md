# lt-ie-9 

[![Bower version](https://badge.fury.io/bo/lt-ie-9.svg)](https://github.com/shinnn/lt-ie-9/releases)
[![NPM version](https://badge.fury.io/js/lt-ie-9.svg)](http://badge.fury.io/js/lt-ie-9)
[![Build Status](https://travis-ci.org/shinnn/lt-ie-9.svg?branch=master)](https://travis-ci.org/shinnn/lt-ie-9)
[![devDependency Status](https://david-dm.org/shinnn/lt-ie-9/dev-status.svg)](https://david-dm.org/shinnn/lt-ie-9#info=devDependencies)

A suite of client-side JavaScript libraries for IE6-8

## Included libraries

* [Selectivizr][selectivizr]
* [Respond.js][respond]
* [HTML5 Shiv][html5shiv]

## Installation

### Install with package manager

#### [Bower](http://bower.io/)

```
bower i --save lt-ie-9
```

#### [npm](https://www.npmjs.org/)

```
npm i --save lt-ie-9
```

#### [Component](https://github.com/component/component)

```
component install shinnn/lt-ie-9
```

## Usage

1. Put [lt-ie-9-min.js](https://raw.githubusercontent.com/shinnn/lt-ie-9/master/lt-ie-9-min.js) (for production) or [lt-ie-9.js](https://raw.githubusercontent.com/shinnn/lt-ie-9/master/lt-ie-9.js) (for development) on your server.
2. Load the script only if the browser is Internet Explorer and its version is less than 9, by using [conditional comment](http://msdn.microsoft.com/library/ms537512%28v=VS.85%29.aspx).

```html
<!--[if lt IE 9]>
<script type="text/javascript" src="path/to/lt-ie-9.min.js"></script>
<![endif]-->
```

## Caveat

### Build status on Travis CI

[![Build Status](https://travis-ci.org/shinnn/lt-ie-9.svg?branch=master)](https://travis-ci.org/shinnn/lt-ie-9)

This repository is tested on [Travis CI](https://travis-ci.org/), but the test doesn't include client-side testing. The build result *"passing"* only guarantees that [the build script][gulpfile] runs without problems.

## Licenses

* [Selectivizr](http://selectivizr.com/) is licensed under [the MIT license](./licenses.md#selectivizr).
* [Respond.js](https://github.com/scottjehl/Respond) is licensed under [the MIT license](./licenses.md#respondjs).
* [HTML5 Shiv](https://github.com/aFarkas/html5shiv) is licensed under [the MIT license and GNU General Public License v2.0](./licenses.md#respondjs).
* [The build script of this project][gulpfile] is licensed under [the MIT license](licenses.md#gulpfilejs).

[selectivizr]: http://selectivizr.com/
[respond]: https://github.com/scottjehl/Respond
[html5shiv]: https://github.com/aFarkas/html5shiv
[gulpfile]: ./gulpfile.js
