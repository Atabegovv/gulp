const { src, dest, watch, parallel, series } = require('gulp');

const sass         = require('gulp-sass')(require('sass'));
const rename       = require('gulp-rename');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const cssmin       = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const imagemin     = require('gulp-imagemin');
const del          = require('del');
const sprite       = require('gulp-svg-sprite');
const webpConv     = require('gulp-webp');
const changed      = require('gulp-changed');
const multiDest    = require('gulp-multi-dest');
const plumber      = require('gulp-plumber');


function browsersyns(){
    browserSync.init({
        server: "app/"
    });
}


function cleanDist(){
    return del('dist')
}


function images(){
    return src('app/images/**/*')
    .pipe(imagemin(
        [
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 99, progressive: true}),
            imagemin.optipng({optimizationLevel: 1}), // 0 - 7
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]
    ))
    .pipe(dest('dist/images'))
}


function video(){
    return src('app/video/**/*')
    .pipe(dest('dist/video'))
}


function build(){
    return src([
        'app/css/libs.min.css',
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/scripts.min.js',
        'app/*.html'
    ],      {base: 'app'})
            .pipe(dest('dist'))
}


function scripts(){
    return src([
        // 'node_modules/jquery/dist/jquery.min.js',
        // 'node_modules/slick-carousel/slick/slick.min.js',
        // 'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
        // 'node_modules/ion-rangeslider/js/ion.rangeSlider.min.js',
        // 'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
        // 'node_modules/rateyo/min/jquery.rateyo.min.js',
        // 'node_modules/mixitup/dist/mixitup.min.js',
        // 'node_modules/@fancyapps/ui/dist/fancybox.umd.js',
        // 'node_modules/swiper/swiper-bundle.min.js',
        // 'node_modules/scrollreveal/dist/scrollreveal.min.js',
        'app/js/main.js'
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}


function styleLibs(){
  return src([
    'node_modules/normalize.css/normalize.css',
    // 'node_modules/slick-carousel/slick/slick.css',
    // 'node_modules/jquery-form-styler/dist/jquery.formstyler.css',
    // 'node_modules/ion-rangeslider/css/ion.rangeSlider.css',
    // 'node_modules/rateyo/min/jquery.rateyo.min.css',
    // 'node_modules/magnific-popup/dist/magnific-popup.css',
    // 'node_modules/@fancyapps/ui/dist/fancybox.css',
    // 'node_modules/swiper/swiper-bundle.min.css',
  ])
    .pipe(concat('libs.min.css'))
    .pipe(cssmin())
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function styles(){
    return src('app/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true,
        }))
        .pipe(sourcemaps.write('../sourcemaps'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}


function svgSprite() {
	return src('app/images/svg/*.svg')
		.pipe(sprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('app/images'))
}


function webp() {
	return src([ 'app/images/*.+(png|jpg|jpeg)', 'app/images/**/*.+(png|jpg|jpeg)' ])
		.pipe(plumber())
		.pipe(changed('app/images', {
			extension: '.webp'
		}))
		.pipe(webpConv())
		.pipe(multiDest(['app/images', 'dist/images']))
}


function watching(){
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/scripts.min.js'], scripts);
    watch(['app/images/*.+(png|jpg|jpeg)', 'app/images/**/*.+(png|jpg|jpeg)'], webp);
    watch(['app/images/svg/*.svg'], svgSprite);
    watch("app/*.html").on('change', browserSync.reload);
}


exports.browsersyns = browsersyns;
exports.cleanDist   = cleanDist;
exports.images      = images;
exports.video       = video;
exports.scripts     = scripts;
exports.styleLibs   = styleLibs;
exports.styles      = styles;
exports.svgSprite   = svgSprite;
exports.webp        = webp;
exports.watching    = watching;

exports.build       = series(cleanDist, images, video, build);
exports.default     = parallel(styles, styleLibs, scripts, svgSprite, webp, browsersyns, watching);