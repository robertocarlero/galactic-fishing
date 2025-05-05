type TabState = {
  activeTabButton: HTMLButtonElement | null;
  activePanel: HTMLElement | null;
};

type TabElements = {
  buttons: NodeListOf<HTMLButtonElement>;
  panels?: NodeListOf<HTMLElement>;
};

const TAB_CLASSES = {
  active: ["bg-white", "text-gray-900", "shadow-sm"],
  inactive: ["bg-transparent", "text-gray-600", "hover:text-gray-800"],
} as const;

function updateTabStyles({
  button,
  isSelected,
}: {
  button: HTMLButtonElement;
  isSelected: boolean;
}): void {
  button.setAttribute("aria-selected", String(isSelected));

  TAB_CLASSES.active.forEach((className) => {
    button.classList.toggle(className, isSelected);
  });

  TAB_CLASSES.inactive.forEach((className) => {
    button.classList.toggle(className, !isSelected);
  });
}

function handleTabClick({
  event,
  state,
  elements,
}: {
  event: Event;
  state: TabState;
  elements: TabElements;
}): void {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    '[role="tab"]',
  );
  if (!button?.dataset.tabId) return;

  activateTab({
    tabId: button.dataset.tabId,
    state,
    elements,
  });
}

function handleTabKeydown({
  event,
  state,
  elements,
}: {
  event: Event;
  state: TabState;
  elements: TabElements;
}): void {
  const keyboardEvent = event as KeyboardEvent;
  if (keyboardEvent.key !== "ArrowRight" && keyboardEvent.key !== "ArrowLeft")
    return;

  keyboardEvent.preventDefault();
  const currentTabIndex = Array.from(elements.buttons).findIndex(
    (button) => button === state.activeTabButton,
  );

  const direction = keyboardEvent.key === "ArrowRight" ? 1 : -1;
  const newIndex =
    (currentTabIndex + direction + elements.buttons.length) %
    elements.buttons.length;

  const newTabButton = elements.buttons[newIndex];
  if (!newTabButton?.dataset.tabId) return;

  activateTab({
    tabId: newTabButton.dataset.tabId,
    state,
    elements,
  });
  newTabButton.focus();
}

function initializePanels({
  panels,
  initialTabId,
}: {
  panels: NodeListOf<HTMLElement>;
  initialTabId: string | undefined;
}): void {
  const activePanelOnInit = Array.from(panels).find(
    (p) => p.dataset.tabId === initialTabId,
  );

  panels.forEach((panel) => {
    panel.classList.toggle("hidden", panel !== activePanelOnInit);
  });
}

function activateTab({
  tabId,
  state,
  elements,
}: {
  tabId: string;
  state: TabState;
  elements: TabElements;
}): void {
  elements.buttons.forEach((button) => {
    const isSelected = button.dataset.tabId === tabId;
    updateTabStyles({ button, isSelected });
    if (isSelected) state.activeTabButton = button;
  });

  if (!elements.panels) return;

  elements.panels.forEach((panel) => {
    const isSelected = panel.dataset.tabId === tabId;
    panel.classList.toggle("hidden", !isSelected);
    if (isSelected) state.activePanel = panel;
  });
}

export function setupTabs(container: HTMLElement): void {
  const initialTabId = container.dataset.initialTab;
  const tabButtons =
    container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  const tabPanelsContainer = container.querySelector(".tab-panels");

  if (!tabPanelsContainer) return;

  const tabPanels = tabPanelsContainer.querySelectorAll<HTMLElement>(
    ':scope > [role="tabpanel"][data-tab-id]',
  );

  const state: TabState = {
    activeTabButton: null,
    activePanel: null,
  };

  const elements: TabElements = {
    buttons: tabButtons,
    panels: tabPanels,
  };

  initializePanels({ panels: tabPanels, initialTabId });

  const tabList = container.querySelector('[role="tablist"]');
  if (!tabList) return;

  tabList.addEventListener("click", (event) =>
    handleTabClick({ event, state, elements }),
  );

  tabList.addEventListener("keydown", (event) =>
    handleTabKeydown({ event, state, elements }),
  );

  // Activar pestaña inicial
  if (initialTabId) {
    activateTab({ tabId: initialTabId, state, elements });
  } else if (tabButtons.length > 0 && tabButtons[0].dataset.tabId) {
    activateTab({ tabId: tabButtons[0].dataset.tabId, state, elements });
  }
}
