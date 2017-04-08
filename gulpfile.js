"use strict";

var gulp = require('gulp'),
	csso = require('gulp-csso'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
imagemin = require('gulp-imagemin'),
 connect = require('gulp-connect'),
  concat = require('gulp-concat'),
  eslint = require('gulp-eslint'),
  	 del = require('del');

var options = {
	src: 'src',
	dist: 'dist'
};

// Lints all JS files and outputs any errors found
// to the console.
gulp.task('lint', function() {
	return gulp.src(options.src + '/js/**/*.js')
		.pipe(eslint({
			rules: {
				"no-console": 1
			},
			globals: [
				'jQuery',
				'$'
			],
			envs: [
				'browser'
			]
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

// Concatenates, minifies, and copies all of the project's JS files into
// an all.min.js file that is then copied to the dist/scripts folder.
// Generates a source map as well.
gulp.task('scripts', ['lint'], function() {
	return gulp.src(options.src + '/**/*.js')
		.pipe(maps.init())
		.pipe(uglify())
		.pipe(concat('all.min.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/scripts'));
});

// Compiles the project's SCSS files into CSS before
// concatenating and minifying them into an all.min.css file.
// Copies the all.min.css file to the dist/styles folder.
// Generates a source map as well.
gulp.task('styles', function() {
	return gulp.src(options.src + '/sass/global.scss')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(csso())
		.pipe(rename('all.min.css'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/styles'));
});

// Optimizes the size of the project's images and then
// copies them into the dist/content folder.
gulp.task('images', function() {
	return gulp.src(options.src + '/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest(options.dist + '/content'));
});

// Deletes all the files and folders in the 'dist' folder
gulp.task('clean', function() {
	return del.sync(options.dist);
});

// Runs the clean, scripts, styles, and images tasks
// before copying index.html and 'icons' folder to 'dist' folder
gulp.task('build', ['clean', 'scripts', 'styles', 'images'], function() {
	return gulp.src([options.src + "/index.html", options.src + "/icons/**"], { base: options.src + '/'})
		.pipe(gulp.dest(options.dist));
});

// Runs the build task before serving the project
// using a local web server, with the 'dist' folder
// as its root folder.
gulp.task('serve', ['build'], function() {
    connect.server({
        root: 'dist',
        livereload: true
    })
});

// Runs the serve task and watches for changes in any JS file.
// Runs the scripts task again if a change is detected.
gulp.task('watch', ['serve'], function() {
	gulp.watch(options.src + '/**/*.js', ['scripts']);
});

// Sets the default gulp command to run the build task
gulp.task('default', function() {
	gulp.start('build');
});




