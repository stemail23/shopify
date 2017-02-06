var should = require("should");
var shrinkwrap = require("../../npm-shrinkwrap");
var path = require("path");
var fs = require("fs");

var checkDependency;

var checkDependencies = function(dependencies, filepath) {
	for (var dependency in dependencies) {
		checkDependency(dependency, dependencies[dependency], filepath);
	}
};

checkDependency = function(name, dependency, filepath) {
	describe(name, function() {
		var packageFile = path.join(filepath, name, 'package.json');
		it('should have a matching package.json file', function() {
			fs.existsSync(packageFile).should.equal(true);
		});
		it('should be the correct version', function() {
			var package = require(packageFile);
			should.exist(dependency.version);
			should.exist(package.version);
			dependency.version.should.equal(package.version);
		});
		if (dependency.dependencies) { checkDependencies(dependency.dependencies, path.join(filepath, name, 'node_modules')); }
	});
};

describe('npm dependencies', function() {
	it('should all be cool', function() {
		checkDependencies(shrinkwrap.dependencies, path.join(__dirname, '../../node_modules'));
	});
});

