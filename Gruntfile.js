'use strict';
module.exports = function (grunt) {
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        //author,product version & license info
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed MIT */\n',
        // Task configuration.
        clean: {
            files: ['dist']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
            },
            extras: {
              src: ['src/css/<%= pkg.name %>.css'],
              dest: 'dist/css/<%= pkg.name %>.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'src/js/<%= pkg.name %>.js',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                  expand: true,
                  cwd: 'src/css',
                  src: ['*.css', '!*.min.css'],
                  dest: 'dist/css',
                  ext: '.min.css'
                }]
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src/img/',
                src: ['**'],
                dest: 'dist/img/'
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                reporterOutput: ''
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/js/.jshintrc'
                },
                src: ['src/**/*.js']
            },
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
        },
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'clean', 'uglify','cssmin', 'copy']);
};
