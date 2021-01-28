const { src, dest }	= require("gulp")
const browserify	= require("gulp-browserify")
const rename		= require("gulp-rename")

exports.default = function() {
	return src("src/main.js")
		.pipe(browserify())
		.pipe(rename("buddle.js"))
        .pipe(dest("src"))
}

