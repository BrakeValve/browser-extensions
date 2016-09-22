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

const bundledScriptFilename = 'main.js'
const destinationDirectory = 'dist'

const jsCompile = () => {
  const entries = glob.sync('src/libs/*.es')

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
  return gulp.src(['src/**/*.es', 'spec/**/*_spec.es'])
          .pipe(eslint())
          .pipe(eslint.format())
          .pipe(eslint.failAfterError())
}

gulp.task('js:lint', () => jsLint())
gulp.task('js:compile', ['js:lint'], () => jsCompile())
gulp.task('js:minify', ['js:compile'], () => jsMinify())
gulp.task('js:bundle', ['js:lint', 'js:compile', 'js:minify'])

gulp.task('default', ['js:bundle'])
