const
$			= require("jquery"),
cryptojs	= require("crypto-js"),
qs			= require("qs")

let lv	= JSON.parse($("nazo").text()) // Note: Get rid of comments.

const
debug	= location.hostname == "localhost",
prompt	= debug ? "%" : "#",
path	= location.pathname.slice(debug ? 1 : 13)
	.replace(/\..+?$/, "") ?? "index",
title	= lv.id + prompt + " " + path

const
$body	= $("body"),
$title	= $(`<title>${title} | HardWayNazo</title>`).appendTo($("head")),
$main	= $(`
<main>
	<h1>${title}</h1>
	<p class="hint"></p>
	<p class="note"></p>
	<p class="play"></p>
</main>
`).appendTo($body),
$hint	= $(".hint"),
$note	= $(".note"),
$play	= $(".play")

const
esc = s => s
	.replace(/ /g, "&nbsp;")
	.replace(/\*\*(.*)\*\*/g, "<b>$1</b>"),
out = (n, $t) => {
	if (! lv[n]) return
	const { text: t, typewriter: tw } = lv[n]
	let c = 0, b = 0
	for (let l of t) {
		l += " "
		let m = l[0] == "!",
			$l = $(m ? `<code></code>` : `<p></p>`).appendTo($t)
		if (m) l = l.slice(1)
		if (tw)
			for (let i = 0; i < l.length; i ++) setTimeout(() => {
				let s = $l.html()
				if (l.slice(i - 1, i + 1) == "**") b ++
				else if (b == 2) {
					b = 0
					s = esc(s)
				}
				$l.html(s + l[i])
			}, ++ c * tw)
		else $l.html(esc(l))
	}
}

const
c = lv.crypto ?? {},
q = Object.entries(qs.parse(location.search.slice(1)))

if (q.length) {
	const t = c[q[0][0]]
	if (typeof t === "string") {
		let f = true, d, o
		try {
			d = cryptojs.AES.decrypt(
				t, cryptojs.enc.Utf8.parse(q[0][1]),
				{ iv: { words: [ 0, 0, 0, 0 ], sigBytes: 16 } }
			).toString(cryptojs.enc.Utf8)
			o = JSON.parse(d)
		}
		catch {
			f = false
		}
		if (f) {
			lv = o
			lv.crypto = c
		}
	}
	else if (typeof t === "object") { 
	// Note: Pass when `t === null`.
	// Debug: Directly access `.c_html` files.
		lv = t
		lv.crypto = c
	}
}

$body.append(`
<style>
h1 {
	font-size: 70px;
	text-align: center;
}
p {
	font-family: serif;
}
code {
	display: block;
	font-family:
		'Fira Code', consolas,
		'Courier New', Courier, monospace;
}
.hint {
	font-size: 26px !important;
	text-align: ${ lv.hint.align ?? "center" };
}
.note {
	position: fixed;
	bottom: 40px;
	right: 5px;
	width: 100%;

	font-size: 20px !important;
	text-align: ${ lv.note?.align ?? "right" };
}
.play {
	text-align: center;
}
.play input, .play button {
	margin: 0 5px;

	background-color: white;
	font-size: 30px;
	text-align: center;

	border: 2px solid black;
	border-radius: 5px;
	outline: none;
}
.play input:focus, .play button:active, .play button:hover {
	border-style: dashed;
}
</style>
`)

out("hint", $hint)
out("note", $note)

let dft = lv.ascend.default ?? ""
switch (lv.ascend.method) {
	case "crypto":
		dft += `?${ lv.ascend.token }=`
	case "input":
		const $in = $(`<input />`).appendTo($play).val(dft)
		const jump = f => {
			if (f) location.href = (debug ? "/" : "/HardWayNazo/") + $in.val()
		}
		if (lv.ascend.answer) $in
			.on("input", () => jump($in.val() == lv.ascend.answer))
		else $(`<button>Nazo!</button>`).appendTo($play)
			.on("click", jump)
		break
}

