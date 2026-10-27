document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear().toString();
});

const pmStandardTabs = [...document.querySelectorAll("[data-pm-standard]")];
const pmStandardPanels = [...document.querySelectorAll("[data-pm-panel]")];

function selectPmStandard(standard, focus = false) {
  pmStandardTabs.forEach((tab) => {
    const selected = tab.dataset.pmStandard === standard;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", selected.toString());
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  pmStandardPanels.forEach((panel) => {
    panel.hidden = panel.dataset.pmPanel !== standard;
  });
}

pmStandardTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectPmStandard(tab.dataset.pmStandard));
  tab.addEventListener("keydown", (event) => {
    let targetIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % pmStandardTabs.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + pmStandardTabs.length) % pmStandardTabs.length;
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = pmStandardTabs.length - 1;
    if (targetIndex == null) return;
    event.preventDefault();
    selectPmStandard(pmStandardTabs[targetIndex].dataset.pmStandard, true);
  });
});
