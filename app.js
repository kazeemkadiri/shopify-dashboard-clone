const listItemValues = {
  activeStep: 0,
  selectedSteps: [],
};

const closeActiveItem = () => {
  // If no item has been selected
  if (listItemValues.activeStep === 0) return;

  // Hide the list item body
  document
    .querySelector(`main[data-onboarding-step="${listItemValues.activeStep}"]`)
    .classList.add("hidden");

  // Add class to show currently selected list item (accordion)
  document
    .querySelector(`.list__container--item.active`)
    .classList.remove("active");

  // Hide image of the previously selected list item (accordion)
  document
    .querySelector(`[data-onboarding-parent="${listItemValues.activeStep}"]`)
    .parentNode.parentNode.parentNode.querySelector("img")
    .classList.add("hidden");
};

const displayListItemBody = (e, selectedStepViaKeyboard = "") => {
  const selectedStep =
    selectedStepViaKeyboard || e.target.dataset.onboardingParent;

  if (isNaN(Number(selectedStep)) || listItemValues.activeStep === selectedStep)
    return;

  const accordionContainer = document.querySelector(
    `[data-onboarding-parent="${selectedStep}"]`
  ).parentNode.parentNode.parentNode;

  closeActiveItem();

  // Display the list item body
  document
    .querySelector(`main[data-onboarding-step="${selectedStep}"]`)
    .classList.remove("hidden");

  // Add class to highlight currently selected list item (accordion)
  accordionContainer.classList.add("active");

  // Display the image of the list item (accordion)
  accordionContainer.querySelector("img").classList.remove("hidden");

  // Save the value of the currently selected list item
  listItemValues.activeStep = +selectedStep;
};

const accordionBodyVisible = (e) =>
  !e.currentTarget.querySelector("main").classList.contains("hidden");

const isNotEnterOrSpacebarKey = (e) => {
  let result = false;

  if (Number(e.keyCode) !== 13 && Number(e.keyCode) !== 32) {
    result = true;
  }

  return result;
};

// Keyboard and Enter key listeners setup for list item accordions
const handleDisplayAccordion = (e) => {
  if (isNotEnterOrSpacebarKey(e)) return;

  if (accordionBodyVisible(e)) return;

  const selectedStep =
    e.currentTarget.querySelector("main").dataset.onboardingStep;

  displayListItemBody(undefined, selectedStep);
};

window.onload = () => {
  const HIDDEN_CLASS = "hidden";

  // Notification list related
  const notificationBell = document.querySelector(
    ".notification__profile--btn"
  );
  const notificationsList = document.querySelector(".notifications__list");

  // Notification profile related
  const notificationProfileBtn = document.querySelector(
    ".notification__profile--details"
  );
  const notificationProfileMenu = document.querySelector(".profile__menu");

  // Alert Box related (Trial callout)
  const infoContainerCloseIcon = document.querySelector(
    ".info__container--x-icon"
  );

  // Setup guides
  const setupGuideArrowContainer = document.querySelector(
    ".setup__guide--right--container"
  );
  const setupGuideArrowDown =
    setupGuideArrowContainer.querySelector(".dropdown-arrow");
  const setupGuideArrowUp = setupGuideArrowContainer.querySelector(".up-arrow");
  const listContainer = document.querySelector(
    ".setup__guide--container .list__container"
  );

  const listContainerItems = document.querySelectorAll(
    ".list__container--item"
  );

  const dashedCirclesContainer = document.querySelectorAll(
    ".list__container--operation--title button"
  );

  const toggleDisplayNotifications = (e) => {
    toggleDisplayMenu(notificationBell, notificationsList);
  };

  const toggleDisplayProfileMenu = (e) => {
    toggleDisplayMenu(notificationProfileBtn, notificationProfileMenu);
  };

  const toggleDisplayMenu = (btn, menu) => {
    // Toggle the focused state of the clicked button
    btn.classList.toggle("active");

    // Toggle the hidden state of the menu box
    menu.classList.toggle("hidden");
  };

  const hideInfoContainer = () =>
    document.querySelector(".info__container").classList.add("hidden");

  const hideInfoContainerUsingKeyboard = (event) => {
    event.preventDefault();

    // when the Enter key (13) is pressed, trigger a button click
    if (event.keyCode === 13) {
      document
        .querySelector(`#${event.target.id}`)
        .dispatchEvent(new Event("click"));
    }
  };

  const toggleDisplaySetupGuides = () => {
    const guidesVisible = () => !listContainer.classList.contains(HIDDEN_CLASS);
    const hideGuides = () => listContainer.classList.add(HIDDEN_CLASS);
    const showGuides = () => listContainer.classList.remove(HIDDEN_CLASS);
    const toggleMainGuidesArrow = () => {
      if (guidesVisible()) {
        setupGuideArrowDown.classList.add(HIDDEN_CLASS);
        setupGuideArrowUp.classList.remove(HIDDEN_CLASS);
      } else {
        setupGuideArrowDown.classList.remove(HIDDEN_CLASS);
        setupGuideArrowUp.classList.add(HIDDEN_CLASS);
      }
    };

    if (guidesVisible()) {
      hideGuides();
    } else {
      showGuides();
    }

    toggleMainGuidesArrow();
  };

  const getDashedCircleIcon = (container) => {
    return container.querySelector(".dashed-circle-icon");
  };

  const getLoadingIcon = (container) => {
    return container.querySelector(".loading-icon");
  };

  const getCompletedCircleIcon = (container) => {
    return container.querySelector(".completed-icon");
  };

  const hideDashedCircle = (container) => {
    getDashedCircleIcon(container).classList.add(HIDDEN_CLASS);
  };

  const hideLoadingIcon = (container) => {
    getLoadingIcon(container).classList.add(HIDDEN_CLASS);
  };

  const hideCompletedCircle = (container) => {
    getCompletedCircleIcon(container).classList.add(HIDDEN_CLASS);
  };

  const showLoadingIcon = (container) => {
    getLoadingIcon(container).classList.remove(HIDDEN_CLASS);
  };

  const showCompletedCircle = (container) => {
    return getCompletedCircleIcon(container).classList.remove(HIDDEN_CLASS);
  };

  const showDashedCircle = (container) => {
    return getDashedCircleIcon(container).classList.remove(HIDDEN_CLASS);
  };

  const changeCircle = (container, selectedStep) => {
    // if dashed circle icon is visible,
    if (!getDashedCircleIcon(container).classList.contains(HIDDEN_CLASS)) {
      hideDashedCircle(container);

      showLoadingIcon(container);

      listItemValues.selectedSteps.push(selectedStep);

      setTimeout(() => {
        hideLoadingIcon(container);
        showCompletedCircle(container);
      }, 1000);
    } else {
      // if completed circle icon is visible
      hideCompletedCircle(container);

      showLoadingIcon(container);

      listItemValues.selectedSteps = listItemValues.selectedSteps.filter(
        (step) => Number(step) !== Number(selectedStep)
      );

      setTimeout(() => {
        hideLoadingIcon(container);
        showDashedCircle(container);
      }, 1000);
    }
  };

  const displayNextListItemBody = () => {
    if (Number(listItemValues.activeStep) < 5) {
      listItemValues.activeStep = Number(listItemValues.activeStep) + 1;
    }

    const accordionContainer = document.querySelector(
      `[data-onboarding-parent="${listItemValues.activeStep}"]`
    ).parentNode.parentNode.parentNode;

    // Display the list item body
    document
      .querySelector(
        `main[data-onboarding-step="${listItemValues.activeStep}"]`
      )
      .classList.remove("hidden");

    // Add class to highlight currently selected list item (accordion)
    accordionContainer.classList.add("active");

    // Display the image of the list item (accordion)
    accordionContainer.querySelector("img").classList.remove("hidden");
  };

  const setCurrentActiveStep = (step) => {
    listItemValues.activeStep = step;
  };

  const clearProgressBar = () =>
    document
      .querySelectorAll(".progress-bar span")
      .forEach((bar) => bar.classList.remove("active"));

  const updateProgressBar = () => {
    const bars = Array.from(document.querySelectorAll(".progress-bar span"));

    clearProgressBar();

    for (let x = 0; x < listItemValues.selectedSteps.length; x++) {
      bars[x].classList.add("active");
    }
  };

  const updateNumCompletedSteps = () => {
    document.querySelector(
      ".setup__guide--progress .num-completed"
    ).innerHTML = `${listItemValues.selectedSteps.length} / 5`;
  };

  const handleCircleClicked = (e) => {
    const circleContainer = e.currentTarget;

    const selectedStep = circleContainer.dataset.onboardingStep;

    changeCircle(circleContainer, selectedStep);

    updateProgressBar();

    updateNumCompletedSteps();

    closeActiveItem();

    setCurrentActiveStep(selectedStep);

    displayNextListItemBody();
  };

  // Register listeners for DOM elements
  notificationBell.addEventListener("click", toggleDisplayNotifications);
  notificationProfileBtn.addEventListener("click", toggleDisplayProfileMenu);
  infoContainerCloseIcon.addEventListener("click", hideInfoContainer);
  infoContainerCloseIcon.addEventListener(
    "keyup",
    hideInfoContainerUsingKeyboard
  );
  setupGuideArrowContainer.addEventListener("click", toggleDisplaySetupGuides);

  // Accordion listeners setup
  listContainerItems.forEach((listItem) => {
    listItem.addEventListener("click", displayListItemBody);
  });

  // Dashed circles listeners setup
  dashedCirclesContainer.forEach((dashedCircleContainer) => {
    dashedCircleContainer.addEventListener("click", handleCircleClicked);
  });
};
