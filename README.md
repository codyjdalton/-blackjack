[![Build Status](https://travis-ci.org/codyjdalton/jule.svg?branch=master)](https://travis-ci.org/codyjdalton/jule) [![Coverage Status](https://coveralls.io/repos/github/codyjdalton/jule/badge.svg?branch=master)](https://coveralls.io/github/codyjdalton/jule?branch=master) [![npm version](https://badge.fury.io/js/jule.svg)](https://badge.fury.io/js/jule)

# Jule

A simple seed app for building CLIs with Node and Javascript.

## Installation

Clone the repo:
```
git clone https://github.com/codyjdalton/jule.git
```

Change directory to the jule project:
```
cd jule
```

Change the name in package.json to your project name:
```json
{
    "name": "your-project",
}
```

Run `npm link` to use your application on the command line:

```
npm install
```
```
npm link
```
```
your-project hello
```