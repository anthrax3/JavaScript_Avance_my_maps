module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		jshint: {
			all: ['js/*.js', '!js/app.min.js']
		},
		uglify: {
			dist: {
				files: {
					'js/app.min.js': ['bower_components/jquery/dist/jquery.js', 'bower_components/bootstrap/dist/js/bootstrap.js', 'bower_components/geocomplete/jquery.geocomplete.js', 'bower_components/js-store-locator/dist/store-locator.min.js', 'js/main.js']
				}
			}
		},
		coffee: {
			compileWithMaps: {
				options: {
					sourceMap: true
				},
				files: {
					'js/main.js': 'js/*.coffee'
				}
			}
		},
		watch: {
			js: {
				files: ['js/*.js'],
				tasks: ['default'],
				options: {
					spawn : false,
					livereload: true
				}
			},
			coffee: {
				files: ['js/main.coffee'],
				tasks: ['coffee'],
				options: {
					spawn : false,
					livereload: true
				}
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'uglify', 'coffee']);
}
