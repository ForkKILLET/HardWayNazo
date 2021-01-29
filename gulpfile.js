const {
	src, dest, parallel
}					= require("gulp")
const browserify	= require("gulp-browserify")
const rename		= require("gulp-rename")
const through2		= require("through2")
const cryptojs		= require("crypto-js")

const buddle = () => src("src/main.js")
	.pipe(browserify())
	.pipe(rename("buddle.js"))
    .pipe(dest("docs"))

// Usage:
//
// <!-- docs/sample.c_html -->
// <p>Text</p>
// <p>
//     <!-- crypto(key 123) Encrypted text -->
// </p>
//
// <!-- docs/sample.html -->
// <p>Text</p>
// <p>
//     
// </p>
const crypto = () => src([ "docs/**/*.c_html" ])
	.pipe(through2.obj((fi, _, cb) => {
		if (fi.isBuffer()) fi.contents = Buffer.from(
			fi.contents.toString()
				.replace(/<!-- crypto\(([^]+?)\)([^]+?)-->/g, () =>
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
	buddle, crypto,
	default: parallel(buddle, crypto)
}

