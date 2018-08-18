'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.preProcess = preProcess;
exports.process = process;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _structorCommons = require('structor-commons');

var _metadata = require('./metadata.js');

var _metadata2 = _interopRequireDefault(_metadata);

var _dependencies = require('./dependencies.js');

var _dependencies2 = _interopRequireDefault(_dependencies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var templateNames = ['index', 'defaultModels', 'docs', 'test'];

var mergeScripts = ['componentsFile', 'moduleIndexFile'];

function preProcess(currentDir, dataObject) {

	var newMetaData = (0, _lodash.cloneDeep)(_metadata2.default);
	return newMetaData;
}

function process(currentDir, dataObject) {

	var templateDatas = {};
	var templateReaders = [];

	templateNames.forEach(function (name) {
		templateReaders.push(_structorCommons.commons.readFile(_path2.default.join(currentDir, 'templates', name + '.tpl')).then(function (fileData) {
			templateDatas[name] = fileData;
		}));
	});
	return Promise.all(templateReaders).then(function () {
		var newDependencies = (0, _lodash.cloneDeep)(_dependencies2.default);
		var files = [];
		var file = void 0;
		var defaults = [];
		templateNames.forEach(function (name) {
			var generatorModule = require(_path2.default.join(currentDir, 'scripts', name + '.js'));
			file = generatorModule.getFile(dataObject, templateDatas[name]);
			if (file.outputFilePath) {
				file.outputFileName = _path2.default.basename(file.outputFilePath);
				files.push(file);
			}
			if (file.defaults && file.defaults.length > 0) {
				defaults = defaults.concat(file.defaults);
			}
		});
		mergeScripts.forEach(function (script) {
			var mergeModule = require(_path2.default.join(currentDir, 'merge', script + '.js'));
			file = mergeModule.getFile(dataObject, _dependencies2.default);
			if (file.outputFilePath) {
				file.outputFileName = _path2.default.basename(file.outputFilePath);
				files.push(file);
			}
		});
		return { files: files, dependencies: newDependencies, defaults: defaults };
	});
}