const http=require("http")
const fs = require("fs")
const url = require("url")

const res_head = f => ({
	"Content-Type": {
		html:	"text/html",
		htm:	"text/html",
		c_html:	"text/html",
		js:		"application/javascript",
		css:	"text/css",
		png:	"image/png",
		jpeg:	"image/jpeg",
		jpg:	"image/jpeg",
		json:	"application/json"
	} [ f.match(/\.([^]+?)$/)[1] ]
		?? "text/plain"
})

http.createServer((req, res) => {
    let file = url.parse(req.url).pathname.slice(1)
	console.log("----", file || "(none)")
	if (! file) {
		file = "index.html"
		console.log("-->> index.html")
	}
	if (! file.includes(".")) {
		file += ".html"
		console.log("-->> " + file)
	}
	fs.access("docs/" + file, fs.constants.R_OK, err => {
		if (err) {
res.writeHead(404, res_head(".html"))
			file = "404.html"
			console.log("-->> 404")
		}
		fs.readFile("docs/" + file, (err, data) => {
			if (err) {
res.writeHead(502, res_head(".html"))
res.write(`<h1>502<h1/>`)
				console.log("--!! 502")
			}
			else {
res.writeHead(200, res_head(file))
res.write(data.toString())
			}
res.end()
		})
	})
}).listen(1628)

console.log("#### Init.")

