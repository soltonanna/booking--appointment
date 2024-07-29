const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

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

// Copy and modify HTML files
function copyHtml() {
  return src('src/index.html')
    .pipe(replace('../dist/css/styles.min.css', './css/styles.min.css'))
    .pipe(replace('../dist/script/main.min.js', './script/main.min.js'))
    .pipe(replace('../images/', './assets/img/'))
    .pipe(dest('dist'));
}

// Copy images to the dist folder
function copyImages() {
  console.log('Copying images...');
  return src('images/**/*')
    .pipe(dest('dist/assets/img'));
}

// Watch for changes in SCSS, JS, HTML, and image files
function watchTask() {
  watch("src/scss/**/*.scss", compilerSass);
  watch("src/js/**/*.js", jsMin);
  watch("src/index.html", copyHtml);
  watch("images/**/*", copyImages);
}

// Default Gulp task
exports.default = series(
  compilerSass,
  jsMin,
  copyHtml,
  copyImages,
  watchTask
);