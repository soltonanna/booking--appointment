const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

// Compile SCSS files to CSS
function compilerSass() {
  return src('src/scss/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix())
    .pipe(minify())
    .pipe(rename('styles.min.css'))
    .pipe(dest('dist/css'));
}

// Minify and concatenate JavaScript files
function jsMin() {
  return src([
    'src/js/*.js',
    'src/js/main.js'
  ], { allowEmpty: true })
    .pipe(terser().on('error', console.error))
    .pipe(concat('main.js'))
    .pipe(rename('main.min.js'))
    .pipe(dest('dist/script'));
}

// Copy HTML files to the dist folder
function copyHtml() {
  return src('src/index.html')
    .pipe(dest('dist'));
}

// Watch for changes in SCSS and JS files
function watchTask() {
  watch("src/scss/**/*.scss", compilerSass);
  watch("src/js/**/*.js", jsMin);
  watch("src/index.html", copyHtml); // Watch for changes in HTML files
}

// Default Gulp task
exports.default = series(
  compilerSass,
  jsMin,
  copyHtml, // Include the copyHtml task in the series
  watchTask
);
