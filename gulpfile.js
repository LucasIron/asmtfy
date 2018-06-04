const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const babel = require('gulp-babel');

gulp.task('vendors', function () {
	[
		'jquery/dist/jquery.min.js',
	].forEach(function (file) {
		gulp.src('./node_modules/' + file)
			.pipe(gulp.dest('./public/js'));
	});
});

gulp.task('assets', function () {
	gulp.src('./source/assets/**/*')
	.pipe(gulp.dest('./public/assets'));
});

gulp.task('html', function () {
	gulp.src('./source/**/*.html')
		.pipe(gulp.dest('./public'));
});

gulp.task('scss', function () {
	gulp.src('./source/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(cleancss())
		.pipe(gulp.dest('./public/css'));
});

gulp.task('js', function () {
	gulp.src('./source/js/**/*.js')
		.pipe(babel({
			'presets': ['env']
		}))
		.pipe(gulp.dest('./public/js/'));
});

gulp.task('img', function () {
	gulp.src('./source/img/**/*')
	.pipe(gulp.dest('./public/img'));
});

gulp.task('mp3', function () {
	gulp.src('./source/mp3/**/*')
	.pipe(gulp.dest('./public/mp3'));
});

gulp.task('build', ['vendors', 'assets', 'html', 'scss', 'js', 'img', 'mp3']);

gulp.task('watch', function () {
	gulp.watch('./source/**/*', ['build']);
});

gulp.task('default', ['build', 'watch']);