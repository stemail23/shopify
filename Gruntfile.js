var spawn = require('child_process').spawn;
var async = require('async');

module.exports = function(grunt) {

	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					mocha: require('mocha')
				},
				// src: ['./test/general/**/*.js', './test/shopify/**/*.js']
				src: ['./test/shopify/**/*.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('default', 'mochaTest');
	grunt.registerTask('test', 'mochaTest');

};
