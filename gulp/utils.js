'use strict';

var fs = require('fs');
var config = require('config');

module.exports = {
    endsWith : endsWith,
    parseVersion : parseVersion,
    parseApiUri: parseApiUri,
    isLintFixed : isLintFixed
};

function endsWith(str, suffix) {
    return str.indexOf('/', str.length - suffix.length) !== -1;
}


function parseVersion() {
    var version = null;
    var versionFile = fs.readFileSync('version.json', 'utf8');
    version = JSON.parse(versionFile).version;
    return version;
}

function parseApiUri(){
    return config.get('autoflow-api-address');
}

function isLintFixed(file) {
	// Has ESLint fixed the file contents?
	return file.eslint !== null && file.eslint.fixed;
}
