const http=require("http")
const fs = require("fs")
const url = require("url")

const res_head = { "Content-Type": "text/html" }

http.createServer((req, res) => {
    const file = url.parse(req.url).pathname.slice(1)
	console.log("Request:", file)
 
	fs.access(file, fs.constants.R_OK, err => {
		if (err) {
res.writeHead(404, res_head)
res.write(`<h2>404 <br/>"${file}" not found.</h3>`)
res.end()
		}
		else fs.readFile(file, (err, data) => {
			if (err) {
res.writeHead(404, res_head)
res.write(`<h2>404 <br/>"${file}" not opened.</h2>`)
			}
			else {
res.writeHead(200, res_head)
res.write(data.toString())
			}
res.end()
		})
	})
}).listen(1628)

console.log("Init.")

