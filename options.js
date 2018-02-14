function loadOptions() {
  var defaultShortcutKey = browser.runtime.getManifest().commands["_execute_browser_action"].suggested_key["default"];
	browser.storage.local.get().then((res) => {
    var newShortcutKey = res.ShortcutKey !== undefined ? res.ShortcutKey : defaultShortcutKey;
		showOption(res.InvertColorsState, res.ImgColorNoInvert, newShortcutKey);
	});
}

function showOption(state, imgNoInvert, shortcutKey) {
  console.log("showOption()=" + shortcutKey);
	document.querySelector("#InvertColorsState").checked = state;
	document.querySelector('#ImgColorNoInvert').checked = imgNoInvert;
  document.querySelector('#ShortcutKey').value = shortcutKey;
  document.querySelector('#ShortcutKeyReset').checked = false;
}


function getCommandKey(name) {
  var shortcutKey = "";
  browser.commands.getAll().then( commands => {
    for (var cmd in commands) {
      if (commands[cmd].name == name) shortcutKey = commands[cmd].shortcut;
      console.log("Command: " + commands[cmd].shortcut + ", name: " + commands[cmd].name + ", desc: " + commands[cmd].description );
    }
    console.log("getCommandKey(" + name + ")=" + shortcutKey);
  });
  return shortcutKey;
}

function setCommandKey(name, shortcutKey) {
  browser.commands.getAll().then( commands => {
    for (var cmd in commands) {
      if (commands[cmd].name == name) commands[cmd].shortcut = shortcutKey;
      console.log("Command: " + commands[cmd].shortcut + ", name: " + commands[cmd].name + ", desc: " + commands[cmd].description );
    }
    console.log("setCommandKey(" + name + ")=" + shortcutKey);
  });
  return shortcutKey;
}
function updateOptions(e) {
  var newShortcutKey = document.querySelector('#ShortcutKeyReset').checked ? 
    browser.runtime.getManifest().commands["_execute_browser_action"].suggested_key["default"] :
    setCommandKey("_execute_browser_action", document.querySelector('#ShortcutKey').value);

  console.log("updateOptions() " + newShortcutKey + ", " + document.querySelector('#ShortcutKeyReset').checked + ", " + document.querySelector('#ShortcutKey').value);

  document.querySelector('#ShortcutKeyReset').checked = false;
  document.querySelector('#ShortcutKey').value = newShortcutKey;

	browser.storage.local.set({
		InvertColorsState: document.querySelector('#InvertColorsState').checked,
		ImgColorNoInvert: document.querySelector('#ImgColorNoInvert').checked,
    ShortcutKey: newShortcutKey
	});

	e.preventDefault();
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector("form").addEventListener("submit", updateOptions);
