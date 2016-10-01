import gulp from 'gulp'
import glob from 'glob'
import browserify from 'browserify'
import babelify from 'babelify'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import eslint from 'gulp-eslint'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import sasslint from 'gulp-sass-lint'
import cleancss from 'gulp-clean-css'
import karma from 'karma'
import path from 'path'

const destinationDirectory = 'dist'
const bundledScriptFilename = 'main.js'
const bundledStyleSheetFilename = 'main.css'

const isCI = process.env.CONTINUOUS_INTEGRATION

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

const jsTest = (done) => {
  const karmaServerConf = {
    configFile: path.resolve(__dirname, (isCI ? 'karma.conf.ci.js' : 'karma.conf.js'))
  }
  return new karma.Server(karmaServerConf, done).start()
}

const cssLint = () => {
  return gulp.src('src/styles/**/*.scss')
          .pipe(sasslint())
          .pipe(sasslint.format())
          .pipe(sasslint.failOnError())
}

const cssCompile = () => {
  return gulp.src('src/styles/**/*.scss')
          .pipe(sourcemaps.init())
          .pipe(sass().on('error', sass.logError))
          .pipe(concat(bundledStyleSheetFilename))
          .pipe(autoprefixer())
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(destinationDirectory))
}

const cssMinify = () => {
  return gulp.src(`${destinationDirectory}/${bundledStyleSheetFilename}`)
          .pipe(cleancss())
          .pipe(rename({ suffix: '.min' }))
          .pipe(gulp.dest(destinationDirectory))
}

gulp.task('js:lint', jsLint)
gulp.task('js:test', jsTest)
gulp.task('js:compile', jsCompile)
gulp.task('js:minify', ['js:compile'], jsMinify)
gulp.task('js:bundle', ['js:lint', 'js:test', 'js:compile', 'js:minify'])

gulp.task('css:lint', cssLint)
gulp.task('css:compile', cssCompile)
gulp.task('css:minify', ['css:compile'], cssMinify)

gulp.task('ci:build', ['js:lint', 'js:test', 'css:lint'])

gulp.task('default', ['js:bundle'])
