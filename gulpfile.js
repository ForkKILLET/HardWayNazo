const
{
	src, dest, parallel
}				= require("gulp"),
babel			= require("gulp-babel"),
uglify			= require("gulp-uglify"),
browserify		= require("gulp-browserify"),
sourcemaps		= require('gulp-sourcemaps'),
rename			= require("gulp-rename"),
through2		= require("through2"),
cryptojs		= require("crypto-js")

const bundle = () => src("src/main.js")
	.pipe(sourcemaps.init())
		.pipe(babel({ presets: [ "@babel/env" ] }))
		.pipe(browserify())
		.pipe(uglify())
		.pipe(rename("bundle.js"))
	.pipe(sourcemaps.write("."))
    .pipe(dest("docs"))

const crypto = () => src([ "docs/**/*.c_html" ])
	.pipe(through2.obj((fi, _, cb) => {
		if (fi.isBuffer()) fi.contents = Buffer.from(
			fi.contents.toString()
				.replace(/<!--crypto\(([^]+?)\)-->([^]+?)<!--\/crypto-->/g, () =>
					`"` + cryptojs.AES.encrypt(
						RegExp.$2,
						cryptojs.enc.Utf8.parse(RegExp.$1),
						{ iv: { words: [ 0, 0, 0, 0 ], sigBytes: 16 } }
					).toString() + `"`
				)
		)
		cb(null, fi)
	}))
	.pipe(rename({ extname: ".html" }))
	.pipe(dest("docs"))

module.exports = {
	bundle, crypto,
	all: parallel(bundle, crypto),
	default: bundle
}

