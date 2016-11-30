'use strict';
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const pug          = require('gulp-pug');
const cssnano      = require('gulp-cssnano');
const rename       = require('gulp-rename');
const del          = require('del');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const browserSync  = require('browser-sync').create();


const reload = browserSync.reload;

// Compile sass files to css
gulp.task('style', function () {
  return gulp.src('./src/stylesheets/main.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 2 versions'], { cascade: true}))
    .pipe(gulp.dest('./src/pages'))
    .pipe(browserSync.reload({stream:true}))
});

// Compile pug files to html
gulp.task('pug', () =>{
  return gulp.src('./src/pages/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./src/pages'))
});


// the working directory
gulp.task('browser-sync', ['style', 'pug'] ,function() {
  browserSync.init({
    server: {
      baseDir: "./src/pages"
    }
  });
});


// Watch files comiling
gulp.task('watch', function () {
  gulp.watch('./src/stylesheets/*.scss', ['style']);
  gulp.watch('./src/stylesheets/**/*.scss', ['style']);
  gulp.watch('./src/blocks/**/*.scss', ['style']);
  gulp.watch('./src/pages/*.pug', ['pug']);
  gulp.watch('./src/blocks/**/*.pug', ['pug']);
  gulp.watch('./src/pages/*.html').on('change', reload);
});

// build
gulp.task('clean', function() {
  return del.sync('build');
});

gulp.task('css-min', ['style'], function() {
  return gulp.src('./src/pages/main.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./src/pages'));
});

gulp.task('img-min', function() {
  return gulp.src('./src/pages/img/*.png')
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./build/img'));
});


// commands
gulp.task('start', ['watch', 'browser-sync']);

gulp.task('build', ['clean', 'img-min', 'style', 'css-min'], function() {
  var buildCss = gulp.src([
    './src/pages/main.css',
    './src/pages/main.min.css'
  ])
    .pipe(gulp.dest('./build/css'))

  var buildFonts = gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./build/fonts'))

  var buildHtml = gulp.src('./src/pages/*.html')
    .pipe(gulp.dest('./build'));
});
