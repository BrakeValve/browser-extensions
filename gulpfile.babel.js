import gulp from 'gulp'
import glob from 'glob'
import browserify from 'browserify'
import babelify from 'babelify'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'

const bundledScriptFilename = 'main.js'
const destinationDirectory = 'dist'

const compile = () => {
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

const minify = () => {
  return gulp.src(`${destinationDirectory}/${bundledScriptFilename}`)
          .pipe(uglify())
          .pipe(rename({ suffix: '.min' }))
          .pipe(gulp.dest(destinationDirectory))
}

gulp.task('js:compile', () => compile())
gulp.task('js:minify', ['js:compile'], () => minify())

gulp.task('default', ['js:compile', 'js:minify'])
