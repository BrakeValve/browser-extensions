module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      dist: {
        options: {
          transform: [
            ['babelify'],
            'envify'
          ]
        },
        src: ['src/*.es'],
        dest: 'dist/main.js'
      }
    },
    uglify: {
      dist: {
        src: 'dist/main.js',
        dest: 'dist/main.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['browserify', 'uglify']);
}
