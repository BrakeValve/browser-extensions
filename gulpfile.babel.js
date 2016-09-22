import gulp from 'gulp'
import glob from 'glob'
import browserify from 'browserify'
import babelify from 'babelify'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'
import eslint from 'gulp-eslint'
import mocha from 'gulp-mocha'
import babel from 'babel-core/register'

const bundledScriptFilename = 'main.js'
const destinationDirectory = 'dist'

const jsCompile = () => {
  const entries = glob.sync('src/libs/**/*.js')

  return browserify({ entries: entries })
          .transform(babelify)
          .bundle()
          .on('error', (err) => console.error(err))
          .pipe(source(bundledScriptFilename))
          .pipe(buffer())
          .pipe(sourcemaps.init({ loadMaps: true }))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(destinationDirectory))
}

const jsMinify = () => {
  return gulp.src(`${destinationDirectory}/${bundledScriptFilename}`)
          .pipe(uglify())
          .pipe(rename({ suffix: '.min' }))
          .pipe(gulp.dest(destinationDirectory))
}

const jsLint = () => {
  return gulp.src(['src/**/*.js', 'spec/**/*.spec.js'])
          .pipe(eslint())
          .pipe(eslint.format())
          .pipe(eslint.failAfterError())
}

const jsTest = () => {
  return gulp.src(['spec/**/*.spec.js'])
           .pipe(
             mocha({
               compilers: {
                 js: babel
               }
             })
           )
}

gulp.task('js:lint', () => jsLint())
gulp.task('js:test', ['js:lint'], () => jsTest())
gulp.task('js:compile', ['js:test'], () => jsCompile())
gulp.task('js:minify', ['js:compile'], () => jsMinify())
gulp.task('js:bundle', ['js:lint', 'js:test', 'js:compile', 'js:minify'])

gulp.task('default', ['js:bundle'])
