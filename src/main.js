$(() => {
try {

	const vc = new VConsole()

	let lv = JSON.parse($("nazo").text())

	const $body = $("body").append(`
<style>
h1 {
	font-size: 70px;
	text-align: center;
}
hint {
	font-size: 26px !important;
	text-align: ${ lv.hint.align || "center" };
}
${ lv.note ? `
	note {
		position: fixed;
		bottom: 40px;
		right: 5px;
		width: 100%;

		font-size: 20px !important;
		text-align: ${ lv.note.align || "right" };
	}
` : ""
}
input {
	font-size: 40px;
	text-align: center;

	border: 2px solid black;
	border-radius: 5px;
	outline: none;
}
input:focus {
	border-style: dashed;
}
</style>
`),
	$title = $(`<title>${ lv.id }# HardWayNazo</title>`).appendTo($("head"))
	$main = $(`
<main>
	<h1>${ lv.id }# ${ location.pathname.split(".")[0].slice(1) }</h1>
	<hint></hint>
	<note></note>
</main>
`).appendTo($body),
	$hint = $("hint")

	const esc = s => s
		.replace(/</g, "&lt;").replace(/>/g, "&gt;")
		.replace(/\*\*(.*)\*\*/g, "<b>$1</b>")
	const out = (t, $t, tw) => {
		if (!t) return
		let c = 0, b = 0
		for (let l of t) {
			l += " "
			let $l = $(`<p></p>`).appendTo($t)
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

	out(lv.hint.text, $("hint"), lv.hint.typewriter)
	if (lv.note) out(lv.note.text, $("note"), false)

	if (lv.ascend.method == "input") {
		const $in = $("<p><input/></p>").appendTo($hint).children().on("input", () => {
			console.log($in.val())
			if ($in.val() == lv.ascend.answer) {
				location.href = lv.ascend.answer + ".html"
			}
		})
	}

} catch(e) { console.error(e.message || e) }
})

