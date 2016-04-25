var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

gulp.task('es5uglify', function(){
    gulp.src('./notify.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({prefix:'es5-', suffix:'.min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('es5', function(){
    gulp.src('./notify.js')
        .pipe(babel())
        .pipe(rename({prefix:'es5-'}))
        .pipe(gulp.dest('./dist'));
});
