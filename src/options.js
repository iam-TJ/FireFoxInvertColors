function loadOptions() {
	browser.storage.local.get().then((res) => {
		showOption(res.InvertColorsState, res.ImgColorNoInvert, res.Workarounds);
	});
}

function showOption(state, imgNoInvert,  workarounds) {
	document.querySelector("#InvertColorsState").checked = state;
	document.querySelector('#ImgColorNoInvert').checked = imgNoInvert;
	document.querySelector('#Workarounds').checked = workarounds;
}


function updateOptions(e) {
	browser.storage.local.set({
		Workarounds: document.querySelector('#Workarounds').checked,
		InvertColorsState: document.querySelector('#InvertColorsState').checked,
		ImgColorNoInvert: document.querySelector('#ImgColorNoInvert').checked
	});

	e.preventDefault();
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector("form").addEventListener("submit", updateOptions);
