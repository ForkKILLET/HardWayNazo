const http=require("http")
const fs = require("fs")
const url = require("url")

const res_head = { "Content-Type": "text/html" }

http.createServer((req, res) => {
    let file = url.parse(req.url).pathname.slice(1)
	console.log("----", file)
 
	fs.access(file, fs.constants.R_OK, err => {
		if (err) {
res.writeHead(404, res_head)
			file = "_/404.html"
			console.log("-->> 404")
		}
		fs.readFile(file, (err, data) => {
			if (err) {
res.writeHead(502, res_head)
res.write(`<h1>502<h1/>`)
				console.log("--!! 502")
			}
			else {
res.writeHead(200, res_head)
res.write(data.toString())
			}
res.end()
		})
	})
}).listen(1628)

console.log("#### Init.")

