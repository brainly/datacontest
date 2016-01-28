const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');
const babel = require('babelify');

gulp.task('sass', () => {
    gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css'));
});

function compile(watch) {
    var bundler = watchify(browserify('./js/app.js', { debug: true })
        .transform(babel.configure({
            presets: ["es2015"]
        })));

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build/js'));
    }

    if (watch) {
        bundler.on('update', () => {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}

gulp.task('js', function() { return compile(); });

gulp.task('watch', () => {
    gulp.watch('./sass/**/*.scss', ['sass']);
    compile(true);
});
