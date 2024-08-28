/*
 * This script loads the projects.json file and displays the projects on the page
 */
async function loadProjects() {
  await loadFont("/fonts/LibreFranklin-Regular.ttf");
  const projectsBox = document.getElementById("projects-box");
  const projectsFutureSwitch = document.getElementById("projects-future-switch");
  const projectsFutureSwitchInput = projectsFutureSwitch.querySelector("input");

  const projectsReq = await fetch("/json/projects.json");
  let projects = (await projectsReq.json()).projects;

  projects = projects.filter((project) => {
    return !project.hide && (!project.publishOn || new Date(project.publishOn) <= new Date());
  });

  for (let project of projects) {
    project.date = new Date(project.date);
    project.ends = new Date(project.date);
    project.ends.setMinutes(project.ends.getMinutes() + (project.lengthMin || 60));
  }

  const pastProjects = projects.filter((project) => {
    return project.ends < new Date();
  }).reverse();

  const futureProjects = projects.filter((project) => {
    return project.ends > new Date();
  });

  let switchCallback = () => {
    projectsFutureSwitchInput.checked = !projectsFutureSwitchInput.checked;
    updateProjects(projectsFutureSwitchInput, projectsBox, pastProjects, futureProjects, switchCallback);
  };

  projectsFutureSwitch.onchange = () => {
    updateProjects(projectsFutureSwitchInput, projectsBox, pastProjects, futureProjects, switchCallback);
    window.navigator.vibrate(10);
  };

  updateProjects(projectsFutureSwitchInput, projectsBox, pastProjects, futureProjects, switchCallback);
}

function updateProjects(projectsFutureSwitchInput, projectsBox, pastProjects, futureProjects, switchCallback) {
  projectsBox.innerHTML = "";
  clearCountdowns();

  if (projectsFutureSwitchInput.checked) {
    addProjects(futureProjects, projectsBox, "No upcoming projects 😳", "No future projects available.", "past", switchCallback);
  } else {
    addProjects(pastProjects, projectsBox, "No past projects 😳", "No projects completed yet.", "future", switchCallback);
  }
}

function addProjects(projects, projectsBox, emptyTitle, emptyMessage, oppositeTabName, switchCallback) {
  if (projects.length === 0) {
    const message = addMessage(projectsBox, emptyTitle, emptyMessage);
    const buttonBar = addButtonBar(message);
    addButton(buttonBar, `See ${oppositeTabName} projects`, switchCallback);
    addButton(buttonBar, "Subscribe to updates", "https://to.osu.dev/newsletter");
  } else {
    for (let project of projects) {
      addProject(project, projectsBox);
    }
  }
}

function addProject(project, parent) {
  const projectElement = document.createElement("p");
  projectElement.classList.add("project");

  addImage(project, projectElement);

  // project info box
  const projectInfo = document.createElement("div");
  projectInfo.classList.add("project-info");

  addWatermark(projectInfo, project);

  addName(project, projectInfo);

  addDescription(project, projectInfo);

  const now = new Date();

  if(project.date<=now){
     addDate(project, projectInfo);
  }

  addTags(project, projectInfo);

  addProjectButtons(project, projectInfo, now);

  projectElement.appendChild(projectInfo);
  parent.appendChild(projectElement);
}

function addImage(project, parent) {
  if (project.imageSrc) {
    const projectImage = document.createElement("img");
    projectImage.src = project.imageSrc;
    projectImage.alt = project.name;
    projectImage.classList.add("project-image");
    parent.appendChild(projectImage);
  }
}

function addTags(project, parent) {
  if (project.tags) {
    const projectTags = document.createElement("p");
    projectTags.classList.add("event-tags");
    parent.appendChild(projectTags);
    for (let tag of project.tags) {
      const tagElement = document.createElement("span");
      tagElement.classList.add("event-tag");
      tagElement.innerHTML = tag;
      projectTags.appendChild(tagElement);
    }
  }
}

function addName(project, parent) {
  const projectName = document.createElement("h2");
  projectName.innerHTML = project.name;
  parent.appendChild(projectName);
}

function addDescription(project, parent) {
  if (project.description) {
    const projectDescription = document.createElement("p");
    projectDescription.innerHTML = project.description;
    parent.appendChild(projectDescription);
  }
}

function addDate(project, parent) {
  const projectDate = document.createElement("p");
  projectDate.textContent =
    `📆 Released on ${project.date.toDateString()}`;
  parent.appendChild(projectDate);
}

function addStartsIn(date, parent) {
  const projectTimeLeft = document.createElement("p");
  projectTimeLeft.classList.add("project-time-left");

  const projectTimeLeftCountdown = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  projectTimeLeftCountdown.innerHTML = '<path d=""></path>';

  projectTimeLeftCountdown.setAttribute("width", "500");
  projectTimeLeftCountdown.setAttribute("height", "32");
  projectTimeLeftCountdown.classList.add("countdown");
  addCountdown(projectTimeLeftCountdown, date, 20, 1, false, () => {
    projectTimeLeft.textContent = "⏳ Started";
    projectTimeLeftCountdown.remove();
  });

  projectTimeLeftCountdown.onclick = () => {
    const query = new URLSearchParams({ date });
    const url = "countdown/?" + query;
    window.open(url, "_blank");
  };

  projectTimeLeft.textContent = "⏳ Starts in";
  projectTimeLeft.appendChild(projectTimeLeftCountdown);
  parent.appendChild(projectTimeLeft);
}

function addProjectButtons(project, parent, now) {
  const projectButtons = addButtonBar(parent);

  if (project.buttons) {
    for (let button of project.buttons) {
      addButton(projectButtons, button.buttonText, button.buttonLink);
    }
  }
}

function addWatermark(parent, project) {
  const watermark = document.createElement("div");
  watermark.classList.add("project-watermark");
  watermark.textContent = project.emoji;
  parent.appendChild(watermark);
}

function addButtonBar(parent) {
  const projectButtons = document.createElement("div");
  projectButtons.classList.add("button-bar");
  parent.appendChild(projectButtons);
  return projectButtons;
}

function addButton(parent, text, link) {
  const button = document.createElement("a");
  if (typeof link == "function") {
    button.onclick = link;
  } else {
    button.href = link;
  }
  button.target = "_blank";
  button.textContent = text;
  parent.appendChild(button);
}

function addGoogleCalendar(parent, project) {
  const url = new URL("https://www.google.com/calendar/render");
  url.searchParams.append("action", "TEMPLATE");

  let name = project.name;
  if (project.emoji) name = project.emoji + " " + name;
  url.searchParams.append("text", name);

  const dateFormatted = project.date.toISOString().replace(/[-:]/g, "").replace(/\.\d\d\d/g, "");
  const endDateFormatted = project.ends.toISOString().replace(/[-:]/g, "").replace(/\.\d\d\d/g, "");

  url.searchParams.append("dates", dateFormatted + "/" + endDateFormatted);
  url.searchParams.append("details", "Check https://osu.dev for latest updates! \n" + project.description);

  addButton(parent, "Google Calendar", url);
}

document.addEventListener('DOMContentLoaded', (e) => {
  loadProjects();
});
