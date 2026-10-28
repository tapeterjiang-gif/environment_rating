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
