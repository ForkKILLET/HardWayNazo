const $			= require("jquery")
const VConsole	= require("vconsole")

$(() => {
try {

	const vc = new VConsole()

	const lv = JSON.parse($("nazo").html())
	const path = location.pathname.match(/\/(.*)\./)[1]

	const $body = $("body").append(`
<style>
h1 {
	font-size: 70px;
	text-align: center;
}
code {
	display: block;
}
.hint {
	font-size: 26px !important;
	text-align: ${ lv.hint.align || "center" };
}
${ lv.note ? `
.note {
	position: fixed;
	bottom: 40px;
	right: 5px;
	width: 100%;

	font-size: 20px !important;
	text-align: ${ lv.note.align || "right" };
}
` : ""
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
.play input:focus, .play button:active {
	border-style: dashed;
}

#__vconsole .vc-switch {
	font-size: 26px;

	background-color: white;
	color: black;
	box-shadow: none;

	border: 2px solid black;
	border-radius: 5px;

	bottom: 0;
	right: 0;
	margin: 5px;
	padding: 5px;
}
#__vconsole #__vc_log_element {
	font-size: 40px!important;
}
</style>
`),
	$title = $(`<title>${ lv.id }# HardWayNazo</title>`).appendTo($("head"))
	$main = $(`
<main>
	<h1>${ lv.id }# ${path}</h1>
	<p class="hint"></p>
	<p class="note"></p>
	<p class="play"></p>
</main>
`).appendTo($body),
	$hint = $(".hint"),
	$note = $(".note"),
	$play = $(".play")
	
	const esc = s => s
		.replace(/ /g, "&nbsp;")
		.replace(/</g, "&lt;").replace(/>/g, "&gt;")
		.replace(/\*\*(.*)\*\*/g, "<b>$1</b>")
	const out = (t, $t, tw) => {
		if (!t) return
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
				}, ++ c * 120)
			else $l.html(esc(l))
		}
	}

	out(lv.hint.text, $hint, lv.hint.typewriter)
	if (lv.note) out(lv.note.text, $note, false)

	if (lv.ascend.method == "input") {
		const $in = $(`<input />`).appendTo($play)
			.val(lv.ascend.default)
		const jump = f => {
			if (f) location.href = $in.val() + ".html"
		}
		if (lv.ascend.answer) $in
			.on("input", () => jump($in.val() == lv.ascend.answer))
		else $(`<button>Nazo!</button>`).appendTo($play)
			.on("click", jump)
	}

} catch(e) { console.error(e.message || e) }
})

