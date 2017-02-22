'use strict';

const
  gulp        = require('gulp'),
  $           = require('gulp-load-plugins')(),
  named       = require('vinyl-named'),
  browserSync = require('browser-sync');

const paths = {
  html: '**/*.html',
  scripts: ['js/**/*.js', '!js/vendors/**/*.js'],
  vendors: 'js/vendors/**/*.js',
  styles: ['scss/**/*.scss', '!scss/**/_*.scss'],
  stylesAndPartials: ['scss/**/*.scss','hotsites/scss/**/*.scss'],
  images: ['img/**/*.{png,jpeg,jpg,svg,gif}'],
  dest: {
    scripts: 'dist/js',
    styles: 'dist/css',
    images: 'dist/img',
    vendors: {
      scripts: 'dist/js/vendors',
      styles: 'dist/css/vendors'
    }
  }
};

var lint = function (files) {
  return gulp.src(files)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
};

var scripts = function(i, o, minify) {
  return gulp.src(i)
    .pipe($.plumber())
    .pipe(named())
    .pipe($.util.env.production || minify ? $.rename({suffix: '.min'}) : $.util.noop())
    .pipe($.util.env.production || minify ? $.uglify() : $.util.noop())
    .pipe(gulp.dest(o));
};

var styles = function(i, o, sync) {
  return gulp.src(i)
    .pipe($.plumber())
    .pipe($.util.env.production ? $.util.noop() : $.sourcemaps.init())
    .pipe($.sass({
      outputStyle: $.util.env.production ? 'compressed' : 'nested',
      includePaths: [
        'node_modules',
        'node_modules/bootstrap-sass/assets/stylesheets'
      ]
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.util.env.production ? $.util.noop() : $.sourcemaps.write('.'))
    .pipe($.rename({dirname: ''}))
    .pipe(gulp.dest(o))
    .pipe(sync ? browserSync.stream({match: '**/*.css'}) : $.util.noop());
};

var images = function(i, o) {
  return gulp.src(i)
    .pipe($.plumber())
    .pipe($.newer(o))
    .pipe($.imagemin({
      optimizationLevel: $.util.env.production ? 5 : 1,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(o));
};

gulp.task('lint', function() {
  return lint(paths.scripts, '');
});

gulp.task('scripts', ['lint'], function() {
  return scripts(paths.scripts, paths.dest.scripts, false);
});

gulp.task('styles', function () {
  return styles(paths.styles, paths.dest.styles, true);
});

gulp.task('vendors', function() {
  return scripts(paths.vendors, paths.dest.vendors.scripts, true);
});

gulp.task('images', function() {
  return images(paths.images, paths.dest.images);
});

gulp.task('serve', ['watch'], function() {
  browserSync({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
});

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.scripts, ['scripts']).on('change', browserSync.reload);
  gulp.watch(paths.vendors, ['vendors']).on('change', browserSync.reload);
  gulp.watch(paths.stylesAndPartials, ['styles']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.html).on('change', browserSync.reload);
});

//gulp.task('build', ['bower.scripts', 'bower.styles', 'vendors', 'scripts', 'styles', 'images'], function() {});
gulp.task('build', ['scripts', 'vendors', 'styles', 'images'], function() {});

gulp.task('default', ['serve'], function() {
});
