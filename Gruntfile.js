module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true
      },
      build: {
        src: ['src/PowerGym.js', 'src/**/*.js'],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      src: {
        files: ['src/**/*.js'],
        tasks: ['default']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify']);
};
