module.exports = (grunt) ->

  # Project configuration
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    uglify:
      options:
        banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        src: '<%= pkg.name %>.js'
        dest: '<%= pkg.name %>.min.js'
    coffee: 
      compile: 
        files: 
          'src/*.js': ['src/*.coffee']
          'tests/*.js': ['tests/*.coffee']
    watch:
      coffee:
        files: ['src/*.coffee', 'tests/*.coffee']
        tasks: ['coffee']
      
  


  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Default task
  grunt.registerTask 'default', ['uglify']