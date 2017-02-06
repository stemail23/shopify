/* jshint expr:true */
var should = require("should");
var semver = require("semver");
var packageFile = require("./../../package.json");

describe('node version', function() {
	describe('The package file', function() {
		it('should contain an engines directive', function() {
			should.exist(packageFile.engines);
		});
		it('should contain a valid engines.node directive', function() {
			should.exist(packageFile.engines.node);
			semver.valid(packageFile.engines.node).should.be.ok;
		});
	});
	describe('The package file engines.node directive ('+packageFile.engines.node+')', function() {
		it('should have a numeric major ('+semver.major(packageFile.engines.node)+') version', function() {
			semver.major(packageFile.engines.node).should.be.a.Number;
		});
		it('should have a numeric minor ('+semver.minor(packageFile.engines.node)+') version', function() {
			semver.minor(packageFile.engines.node).should.be.a.Number;
		});
		it('should have a numeric patch ('+semver.patch(packageFile.engines.node)+') version', function() {
			semver.patch(packageFile.engines.node).should.be.a.Number;
		});
	});
	describe('The NodeJS version ('+process.version+')', function() {
		it('should be a valid version', function() {
			semver.valid(process.version).should.be.ok;
		});
/*
CANT GET THIS TEST TO WORK ON THE CURRENT BUILD MACHINE. TROUBLE USING 'N' TO CHANGE NODE VERSION
		it('should meet the package file engines specification ('+packageFile.engines.node+')', function() {
			semver.satisfies(process.version, packageFile.engines.node).should.be.ok;
		});
*/
	});
});

