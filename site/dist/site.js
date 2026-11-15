const legacyIndicatorHashes = new Set([
  "thermal", "air", "sound-light", "outdoor",
  "pollen", "uv-index", "o3", "co", "so2"
]);
const guidePath = window.location.pathname;
const oldHash = window.location.hash.slice(1);
if ((guidePath.endsWith("/") || guidePath.endsWith("/index.html")) &&
    (legacyIndicatorHashes.has(oldHash) || oldHash === "color-principles" || oldHash === "icon-sources")) {
  const isDesignResource = oldHash === "color-principles" || oldHash === "icon-sources";
  const destination = new URL(isDesignResource ? "design.html" : "indicators.html", window.location.href);
  destination.search = window.location.search;
  destination.hash = oldHash === "color-principles" ? "color-resources" : oldHash === "icon-sources" ? "icon-resources" : window.location.hash;
  window.location.replace(destination.href);
}
if (guidePath.endsWith("/indicators.html") && (oldHash === "icon-sources" || oldHash === "color-principles")) {
  const destination = new URL("design.html", window.location.href);
  destination.search = window.location.search;
  destination.hash = oldHash === "icon-sources" ? "icon-resources" : "color-resources";
  window.location.replace(destination.href);
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear().toString();
});

document.querySelectorAll("[data-standard-switcher]").forEach((switcher) => {
  const group = switcher.dataset.standardSwitcher;
  const tabs = [...switcher.querySelectorAll("[data-standard-option]")];
  const panels = [...document.querySelectorAll(`[data-standard-group="${group}"]`)];

  function selectStandard(standard, focus = false) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.standardOption === standard;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", selected.toString());
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.standardPanel !== standard;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectStandard(tab.dataset.standardOption));
    tab.addEventListener("keydown", (event) => {
      let targetIndex;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") targetIndex = 0;
      if (event.key === "End") targetIndex = tabs.length - 1;
      if (targetIndex == null) return;
      event.preventDefault();
      selectStandard(tabs[targetIndex].dataset.standardOption, true);
    });
  });
});
