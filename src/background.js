function nullFunc() {
}

function setColors(tabId) {
    browser.storage.local.get().then((res) => {
        setColorsToState(tabId, res.InvertColorsState, res.ImgColorNoInvert, res.Workarounds);
    });
}

function setColorsToState(tabId, state, imgNoInvert, workarounds) {
    if (state == true) {
        invertColors(tabId);
        if (workarounds) applyWorkarounds(tabId);
        if (imgNoInvert) invertImg(tabId);
    } else {
        revertImg(tabId);
        revertWorkarounds(tabId);
        revertColors(tabId);
    }
    browser.sessions.setTabValue(tabId, "invertColors", state).then(nullFunc(), nullFunc());
    browser.sessions.setTabValue(tabId, "imgNoInvert", imgNoInvert).then(nullFunc(), nullFunc());
}

function toggleColors(obj, tab) {
    browser.storage.local.get().then((res) => {
      if (tab) {
        browser.sessions.getTabValue(tab.id, "invertColors").then( tabState => {
          tabState = !tabState;
          browser.sessions.getTabValue(tab.id, "imgNoInvert").then( imgNoInvert => {
            setColorsToState(tab.id, tabState, res.ImgColorNoInvert, res.Workarounds);
          }, nullFunc());
        }, nullFunc());
      } else {
        var state = res.InvertColorsState ? res.InvertColorsState : false;
        state = obj != false ? !state : state;
        setIconState(state);

        browser.storage.local.set({ InvertColorsState: state, ImgColorNoInvert: res.ImgColorNoInvert, Workarounds: res.Workarounds });

        browser.tabs.query({}).then((tabs) => {
            for (var tab of tabs) {
                setColorsToState(tab.id, state, res.ImgColorNoInvert, res.Workarounds);
            };
        }, nullFunc());
      }
    });
}

function setIconState(state) {
    if (state) {
        browser.browserAction.setIcon({ path: "icons/on.svg" });
        browser.browserAction.setTitle({ title: "Revert Colors" });
    } else {
        browser.browserAction.setIcon({ path: "icons/off.svg" });
        browser.browserAction.setTitle({ title: "Invert Colors" });
    }
}

function invertImg(tabId) {
    browser.tabs.insertCSS(tabId, {
        file: "image.css"
    });
}

function revertImg(tabId) {
    browser.tabs.removeCSS(tabId, {
        file: "image.css"
    });
}


function invertColors(tabId) {
    browser.tabs.insertCSS(tabId, {
        file: "style.css"
    });
}

function revertColors(tabId) {
    browser.tabs.removeCSS(tabId, {
        file: "style.css"
    });
}

function applyWorkarounds(tabId) {
  browser.tabs.insertCSS(tabId, {
    file: "workarounds.css",
    allFrames: false
  });
}

function revertWorkarounds(tabId) {
  browser.tabs.removeCSS(tabId, {
    file: "workarounds.css",
    allFrames: false
  });
}

function handleUpdated(tabId, changeInfo, tabInfo) {

    if (changeInfo.status) {
        setColors(tabId);
    }
}

function handleStorageUpdate(changes, area) {
    if (area == "local") {
        for (var item of Object.keys(changes)) {
            if (item == "InvertColorsState" || item == "ImgColorNoInvert" || item == "Workarounds") {
                browser.storage.local.get().then((res) => {
                    var state = res.InvertColorsState ? res.InvertColorsState : false;
                    setIconState(state);

                    browser.tabs.query({}).then((tabs) => {
                        for (var tab of tabs) {
                            setColorsToState(tab.id, state, res.ImgColorNoInvert, res.Workarounds);
                        };
                    });
                });
            }
        }
    }
}


browser.contextMenus.create({
    id: "InvertColors",
    title: "Invert Colors"
});

browser.tabs.onUpdated.addListener(handleUpdated);
browser.storage.onChanged.addListener(handleStorageUpdate);
browser.browserAction.onClicked.addListener(toggleColors);
browser.contextMenus.onClicked.addListener(toggleColors);

toggleColors(false);
