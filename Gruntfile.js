module.exports = function(grunt) {
	"use strict";
	grunt.loadNpmTasks("grunt-eslint");	
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-openui5");
	

	grunt.initConfig({
		dir: {
			source: "webapp/src",
			dist: "dist"
		},
		clean: {
			dist: "<%= dir.dist %>"
		},
		openui5_preload: {
			library: {
			  options: {
			    resources: { 
			    	cwd: "<%= dir.source %>"
			    },
			    dest: "<%= dir.dist %>"
			  },
			  libraries: true
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: "<%= dir.source %>",
					src: [
						"**"
					],
					dest: "<%= dir.dist %>"
				}]
			}
		},
		eslint: {
			webapp: ["<%= dir.source %>"]
		}
	});
	
	// Linting task
	grunt.registerTask("cleanup", [
		"clean"
	]);
	
	// Linting task
	grunt.registerTask("lint", [
		"eslint"
	]);
	
	// Build task
	grunt.registerTask("build", [
		"openui5_preload", 
		"copy"
	]);

	grunt.registerTask("default", [
		//"lint",
		"cleanup"
		,"build"
	]);
};