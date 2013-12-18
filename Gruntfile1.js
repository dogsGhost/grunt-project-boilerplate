'use strict';


var lrSnippet = require('connect-livereload')({
  port: 1337
});

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};


module.exports = function (grunt) {

  /**
   * Grunt config
   */
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /**
     * Set project info
     */
    project: {
      src: 'src',
      app: 'dev',
      css: [
        '<%= project.src %>/sass/style.scss'
      ],
      js: [
        '<%= project.src %>/js/*.js'
      ]
    },

    // Add attributions to top of files.
    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * @author <%= pkg.author %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' */\n'
    },

    // connect to live reload
    connect: {
      options: {
        port: 8675,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [lrSnippet, mountFolder(connect, 'dev')];
          }
        }
      }
    },

    // run jshint
    jshint: {
      files: ['src/js/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Coffeescript compiler
    coffee: {
      compile: {
        options: {
          bare: true,
          sourceMap: true
        },
        files: {
          // Currently set for backbone project. Should probaby change to option rather than default.
          '<%= project.app %>/js/app.js': [
            '<%= project.src %>/coffee/*.coffee',
            '<%= project.src %>/coffee/models/*.coffee',
            '<%= project.src %>/coffee/views/*.coffee',
            '<%= project.src %>/coffee/collections/*.coffee'
          ]
        }
      }
    },

    // concat js files
    concat: {
      dev: {
        files: {
          '<%= project.app %>/js/app.js': ['<%= project.src %>/js/*/*.js', '<%= project.js %>']
        }
      },
      options: {
        stripBanners: true,
        nonull: true,
        banner: '<%= tag.banner %>'
      }
    },

    // minify
    uglify: {
      options: {
        banner: '<%= tag.banner %>'
      },
      dist: {
        files: {
          '<%= project.app %>/js/scripts.min.js': '<%= project.js %>'
        }
      }
    },

    // compile sass
    sass: {
      dev: {
        options: {
          style: 'expanded',
          banner: '<%= tag.banner %>'
          // sourcemap: true
        },
        files: {
          '<%= project.app %>/css/style.css': '<%= project.css %>'
        }
      },
      dist: {
        options: {
          style: 'compressed',
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.app %>/css/style.css': '<%= project.css %>'
        }
      }
    },

    // Opens the web server in the browser
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },

    // Runs tasks against changed watched files
    // Watching development files and run concat/compile tasks
    // Livereload the browser once complete
    watch: {
      // concat: {
      //   files: '<%= project.src %>/js/{,*/}*.js',
      //   tasks: ['concat:dev', 'jshint']
      // },
      sass: {
        files: '<%= project.src %>/sass/{,*/}*.{scss,sass}',
        tasks: ['sass:dev']
      },
      coffee: {
        files: ['<%= project.src %>/coffee/*.coffee', '<%= project.src %>/coffee/*/*.coffee'],
        tasks: ['coffee']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= project.app %>/index.html',
          '<%= project.app %>/css/*.css',
          '<%= project.app %>/js/{,*/}*.js',
          '<%= project.app %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  });


  // Load multiple grunt tasks instead of having to load each one seperately.
  require('load-grunt-tasks')(grunt);


  // Here we register our task commands. Add/delete or comment/uncomment tasks as needed.

  // Default task - Run 'grunt' on the command line
  grunt.registerTask('default', [
    'sass:dev',
    // 'jshint',
    // 'concat:dev',
    'coffee',
    'connect:livereload',
    'open',
    'watch'
  ]);

  // Build task - Run 'grunt dist' on the command line
  grunt.registerTask('dist', [
    // 'sass:dist',
    // 'jshint',
    // 'uglify'
  ]);

};
