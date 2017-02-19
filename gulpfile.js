"use strict";
var gulp = require("gulp");
var connect = require("gulp-connect"); // run a local dev server
var open = require("gulp-open"); // open url in web browser
var browserify = require("browserify"); // bundle JS
var reactify = require("reactify"); // transforms react JSX to JS
var source = require("vinyl-source-stream"); // use conventional text streams with gulp
var concat = require("gulp-concat"); // concatinates files
var lint = require('gulp-eslint'); // Lint JS files, including JSX

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        dist: './dist',
        mainJs: './src/main.js',
        css: [
            'C:\Users\Rigz\Web\reacttutorial\node_modules\bootstrap\dist\css\bootstrap-theme.min.css',
            'C:\Users\Rigz\Web\reacttutorial\node_modules\bootstrap\dist\css\bootstrap.min.css'
        ]
    }
}

//start a local development server
gulp.task('connect', function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function() {
    gulp.src('dist/index.html')
        .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
});

gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
})

gulp.task('css', function() {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('lint', function() {
    return gulp.src(config.paths.js)
        .pipe(lint({ config: 'eslint.config.json' }))
        .pipe(lint.format());
})

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js), ['js', ['lint']];
});

gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);