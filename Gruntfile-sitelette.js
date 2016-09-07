// grunt --gruntfile=Gruntfile-sitelette.js
'use strict';

var grunt = require('grunt');
var argv = require('yargs').argv;

grunt.log.write('compiling ','sitelette');

var webpackConfig = require('./webpack-sitelette.config.js');

// stop webpack watch and keepalive
webpackConfig.watch = false;
webpackConfig.keepalive = false;

// Creating multiple stylesheet's paths with diff themes (for cssmin task)
var themes = function() {
    // Number of themes
    var themeNumber = 4;
    var distStyle = {};
    for (var i = 1; i <= themeNumber; i++) {
        var styles='<%= yeoman.app %>/build/styles.css',
            distFile='<%= yeoman.dist %>/build/styles'+i+'.css',
            themeName='<%= yeoman.app %>/styles/themes/theme'+i+'/sitelette_theme'+i+'.css';
        distStyle[distFile] = [styles, themeName];
    };
    return distStyle;
};

module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    var webpack = require('webpack');

    var yeomanConfig = {
        app: 'app/app_sitelette',
        dist: 'dist',
        indexFile: 'prod-index.html'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,

        webpack: {
            options: webpackConfig,
            start: {
            }
        },
        clean: [
            './dist.zip',
            '<%= yeoman.dist %>',
            '<%= yeoman.app %>/build'
        ],
        uglify: {
            options: {
                compress: true,
                mangle: true
            },
            target: {
                src: '<%= yeoman.dist %>/build/bundle.js',
                dest: '<%= yeoman.dist %>/build/bundle.js'
            }
        },
        cssmin: {
            target: {
                files: themes()
            },
            options: {
                report: 'min'
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: [
                            '*.{ico,txt,png}',
                            '.htaccess',
                        ],
                        dest: '<%= yeoman.dist %>'
                    },
                    // copy sitefiles
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: [
                            'sitefiles/**'
                        ],
                        dest: '<%= yeoman.dist %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: [
                            '*.php', 
                            '!sitelette-production.php',
                            '!production-index.php'
                        ],
                        dest: '<%= yeoman.dist %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/no_sitelette',
                        src: ['{,*/}*', '!dev-index.php'],
                        dest: '<%= yeoman.dist %>/no_sitelette'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/desktop',
                        src: ['**', '!dev-index.php'],
                        dest: '<%= yeoman.dist %>/desktop'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/error_page',
                        src: ['{,*/}*', '!dev-index.php'],
                        dest: '<%= yeoman.dist %>/error_page'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/build',
                        src: '{,*/}*',
                        dest: '<%= yeoman.dist %>/build'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/icons',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/styles/icons/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/themes',
                        src: '**',
                        dest: '<%= yeoman.dist %>/themes'
                    },
                    {
                        src: '<%= yeoman.app %>/sitelette-production.php',
                        dest: '<%= yeoman.dist %>/sitelette.php'
                    },
                    {
                        src: '<%= yeoman.app %>/styles/themes/theme2/sprite_navbar_theme2.png',
                        dest: '<%= yeoman.dist %>/build/sprite_navbar_theme2.png'
                    },
                    {
                        src: '<%= yeoman.app %>/styles/themes/theme2/sprite_buttons_theme9.png',
                        dest: '<%= yeoman.dist %>/build/sprite_buttons_theme9.png'
                    }
                ]
            }
        },
        compress: {
            dist: {
                options: {
                    archive: './dist.zip',
                    mode: 'zip'
                },
                files: [
                    { src: './dist/**' }
                ]
            }
        },
        // Here will be replacements for production files
        replace: {
            dist: {
                src: ['<%= yeoman.app %>/index.php'],
                dest: '<%= yeoman.dist %>/',
                replacements: [{
                    from: 'app_sitelette/',
                    to: ''
                },{
                    from: 'dev-',
                    to: ''
                }]
            }
        }
    });
    grunt.registerTask('default', function() {
        grunt.task.run([
            'clean',
            'webpack',
            'copy',
            'replace',
            'uglify',
            'cssmin',
            'compress'
        ]);
    });
};