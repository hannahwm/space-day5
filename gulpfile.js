var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
var fileinclude = require('gulp-file-include');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var strip = require('gulp-strip-comments');
var htmlbeautify = require('gulp-html-beautify');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
  return gulp.src('app/scss/main.scss') // Gets all files ending with .scss in app/scss
    .pipe(concat('styles.scss'))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      safe: true,
      add: true,
      remove: false,
      browsers: [
        'last 4 versions',
        '> 2%'
      ]
    }))
    .pipe(rename('day5.min.css'))
    .pipe(gulp.dest('dist/interactive/2019/07/space-week/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe( notify({ message: "sass tasks have been completed!"}) );
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('app/js/plugins/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/js'))
        .pipe(rename('day5.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/interactive/2019/07/space-week/js'))
        .pipe(browserSync.reload({
          stream: true
        }))
        .pipe( notify({ message: "plugins have been compiled!"}) );
});

gulp.task('copyJSLibraries', function() {
  return gulp.src('app/js/library/**/*.js')
    .pipe(gulp.dest('dist/interactive/2019/07/space-week/js/library'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe( notify({ message: "js libraries have been moved to dist!"}) );
});

gulp.task('copyFonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/interactive/2019/07/space-week/fonts'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe( notify({ message: "fonts have been moved to dist!"}) );
});

gulp.task('video', function() {
  return gulp.src('app/video/**/*.mp4')
    .pipe(gulp.dest('dist/interactive/2019/07/space-week/video'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe( notify({ message: "videos have been moved to dist!"}) );
});


/*in order to make sure the image path matches the path in Wordpress,
you can change the "dist" destination below. Instead of "dist/images" it would be something like
dist/interactive/2018/10/your-project/images.
Note: Remember to only upload the /images folder to your project folder in Wordpress (not the whole
"dist/interactive/2018/..." since that would defeat the purpose)*/
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/interactive/2019/07/space-week/images/day05'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe( notify({ message: "image tasks have been completed!"}) );
});

gulp.task('html', function(){
  var options = {
    "indent_size": 4
  };
  return gulp.src('dist/index.html')
  .pipe(strip())
  .pipe(htmlbeautify({options}))
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe( notify({ message: "html tasks have been completed!"}) );
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
});

gulp.task('fileinclude', function() {
  return gulp.src(['app/**/*.html'])
  .pipe(fileinclude())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe( notify({ message: "fileInclude tasks have been completed!"}) );
});

gulp.task('watch', ['browserSync', 'sass', 'scripts', 'copyJSLibraries', 'copyFonts', 'video', 'images', 'fileinclude', 'html'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/**/*.html', ['fileinclude']);
  gulp.watch('app/js/plugins/**/*.js', ['scripts']);
  gulp.watch('app/js/library/**/*.js', ['copyJSLibraries']);
  gulp.watch('app/fonts/**/*', ['copyFonts']);
  gulp.watch('app/video/**/*.mp4', ['video']);
  gulp.watch('app/images/**/*', ['images']);
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
    .pipe( notify({ message: "useref tasks have been completed!"}) );
});

gulp.task('clean:dist', function() {
  return del.sync('dist/**/*');
})


gulp.task('default', function (callback) {
  runSequence(['clean:dist', 'sass', 'images', 'video', 'fileinclude', 'scripts', 'copyJSLibraries', 'copyFonts', 'useref', 'html', 'browserSync', 'watch'],
    callback
  )
})

gulp.task('build', function (callback) {
  runSequence(
    'clean:dist',
    'sass',
    'images',
    'fileinclude',
    'scripts',
    'copyJSLibraries',
    'copyFonts',
    'video',
    'html',
    callback
  )
})
