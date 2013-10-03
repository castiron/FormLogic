module.exports = (grunt) ->

  # Project configuration
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    uglify:
      options:
        banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        src: 'src/<%= pkg.name %>.js'
        dest: 'src/<%= pkg.name %>.min.js'
    coffee: 
      compile_src: 
        files:
          'src/form-logic.js': 'src/form-logic.coffee'
      compile_test:
        files:
          'tests/test.js': 'tests/test.coffee'
    sass:
      dist:
        files:
          'tests/styles.css': 'tests/styles.scss'
    watch:
      coffee:
        files: ['src/*.coffee', 'tests/*.coffee']
        tasks: ['coffee']
      sass:
        files: ['tests/*.scss']
        tasks: ['sass']
      
  


  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-sass'

  # Default task
  grunt.registerTask 'default', ['uglify']