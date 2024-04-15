/*
 * This script loads the events.json file and displays the events on the page
 */
async function loadEvents() {
  await loadFont("/fonts/LibreFranklin-Regular.ttf");
  const eventsBox = document.getElementById("events-box");
  const eventsFutureSwitch = document.getElementById("events-future-switch");
  const eventsFutureSwitchInput = eventsFutureSwitch.querySelector("input");

  const eventsReq = await fetch("/json/events.json");
  let events = (await eventsReq.json()).events;

  events = events.filter((event) => {
    return !event.hide && (!event.publishOn || new Date(event.publishOn) <= new Date());
  });

  for (let event of events) {
    event.date = new Date(event.date);
    event.ends = new Date(event.date)
    event.ends.setMinutes(event.ends.getMinutes() + (event.lengthMin || 60));
  }

  const pastEvents = events.filter((event) => {
    return event.ends < new Date();
  }).reverse();

  const futureEvents = events.filter((event) => {
    return event.ends > new Date();
  });

  let switchCallback = () => {
    eventsFutureSwitchInput.checked = !eventsFutureSwitchInput.checked;
    updateEvents(eventsFutureSwitchInput, eventsBox, pastEvents, futureEvents, switchCallback);
  };

  eventsFutureSwitch.onchange = () => {
    updateEvents(eventsFutureSwitchInput, eventsBox, pastEvents, futureEvents, switchCallback);
    window.navigator.vibrate(10);
  };

  updateEvents(eventsFutureSwitchInput, eventsBox, pastEvents, futureEvents, switchCallback);
}

function updateEvents(eventsFutureSwitchInput, eventsBox, pastEvents, futureEvents, switchCallback) {
  eventsBox.innerHTML = "";
  clearCountdowns();

  if (eventsFutureSwitchInput.checked) {
    addEvents(futureEvents, eventsBox, "Nothing planned yet 😳", "Without a time machine, there is no way I can tell.", "past", switchCallback)
  } else {
    addEvents(pastEvents, eventsBox, "Nothing happened yet 😳", "Nothing ever was, but everything will be.", "future", switchCallback)
  }

  // if (mHate) { mHate.crossIn(eventsBox); }
}

function addEvents(events, eventsBox, emptyTitle, emptyMessage, oppositeTabName, switchCallback) {
  if (events.length === 0) {
    const message = addMessage(eventsBox, emptyTitle, emptyMessage);
    const buttonBar = addButtonBar(message);
    addButton(buttonBar, `See ${oppositeTabName} events`, switchCallback)
    addButton(buttonBar, "Subscribe to updates", "https://to.osu.dev/newsletter")
  } else {
    for (let event of events) {
      addEvent(event, eventsBox);
    }
  }
}

function addMessage(parent, title, message) {
  const messageBody = document.createElement("p");
  messageBody.classList.add("center", "center-text");
  parent.appendChild(messageBody);

  const messageTitle = document.createElement("h2");
  messageTitle.textContent = title;
  messageBody.appendChild(messageTitle);

  const messageP = document.createElement("p");
  messageP.textContent = message;
  messageBody.appendChild(messageP);

  return messageBody;
}

function addEvent(event, parent) {
  const eventElement = document.createElement("p");
  eventElement.classList.add("event");

  addImage(event, eventElement);

  // event info box
  const eventInfo = document.createElement("div");
  eventInfo.classList.add("event-info");

  addWatermark(eventInfo, event);

  addName(event, eventInfo);


  addDescription(event, eventInfo);

  const now = new Date();

  addDate(event, eventInfo);

  if (event.date > now) {
    addStartsIn(event.date, eventInfo);
  }

  addLocation(event, eventInfo);

  addTags(event, eventInfo);

  addEventButtons(event, eventInfo, now);

  eventElement.appendChild(eventInfo);
  parent.appendChild(eventElement);
}

function addImage(event, parent) {
  if (event.imageSrc) {
    const eventImage = document.createElement("img");
    eventImage.src = event.imageSrc;
    eventImage.alt = event.name;
    eventImage.classList.add("event-image");
    parent.appendChild(eventImage);
  }
}

function addTags(event, parent) {
  if (event.tags) {
    const eventTags = document.createElement("p");
    eventTags.classList.add("event-tags");
    parent.appendChild(eventTags);
    for (let tag of event.tags) {
      const tagElement = document.createElement("span");
      tagElement.classList.add("event-tag");
      tagElement.innerHTML = tag;
      eventTags.appendChild(tagElement);
    }
  }
}

function addName(event, parent) {
  const eventName = document.createElement("h2");
  eventName.innerHTML = event.name;
  parent.appendChild(eventName);
}

function addDescription(event, parent) {
  if (event.description) {
    const eventDescription = document.createElement("p");
    eventDescription.innerHTML = event.description;
    parent.appendChild(eventDescription);
  }
}

function addDate(event, parent) {
  const eventDate = document.createElement("p");
  eventDate.textContent =
    `📆 ${event.date.toDateString()}, ${event.date.toLocaleTimeString()} - ${event.ends.toLocaleTimeString()}`;
  parent.appendChild(eventDate);
}

function addStartsIn(date, parent) {
  const eventTimeLeft = document.createElement("p");
  eventTimeLeft.classList.add("event-time-left");

  // svg
  const eventTimeLeftCountdown = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  eventTimeLeftCountdown.innerHTML = '<path d=""></path>';

  eventTimeLeftCountdown.setAttribute("width", "500");
  eventTimeLeftCountdown.setAttribute("height", "32");
  eventTimeLeftCountdown.classList.add("countdown");
  addCountdown(eventTimeLeftCountdown, date, 20, 1, false, () => {
    // callback for when the countdown is finished
    eventTimeLeft.textContent = "⏳ Started";
    eventTimeLeftCountdown.remove();
  });

  // redirect to countdown page
  eventTimeLeftCountdown.onclick = () => {
    const query = new URLSearchParams({ date });
    const url = "countdown/?" + query;
    window.open(url, "_blank");
  };

  eventTimeLeft.textContent = "⏳ Starts in";
  eventTimeLeft.appendChild(eventTimeLeftCountdown);
  parent.appendChild(eventTimeLeft);
}

function addLocation(event, parent) {
  if (event.location) {
    const eventLocation = document.createElement("p");
    eventLocation.textContent = "📍 " + event.location;
    parent.appendChild(eventLocation);
  }
}

function addRSVP(parent) {
  addButton(parent, "RSVP", "https://to.osu.dev/rsvp");
}

function addGoogleCalendar(parent, event) {
  const url = new URL("https://www.google.com/calendar/render");
  url.searchParams.append("action", "TEMPLATE");

  let name = event.name;
  if (event.emoji) name = event.emoji + " " + name;
  url.searchParams.append("text", name);

  //format date as YYYYMMDDTHHmmSSZ
  const dateFormatted = event.date.toISOString().replace(/[-:]/g, "").replace(/\.\d\d\d/g, "");
  const endDateFormatted = event.ends.toISOString().replace(/[-:]/g, "").replace(/\.\d\d\d/g, "");

  url.searchParams.append("dates", dateFormatted + "/" + endDateFormatted);
  url.searchParams.append("location", event.location + " (Check osu.dev for updates)");
  url.searchParams.append("details", "Check https://osu.dev for latest updates! \n" + event.description);

  addButton(parent, "Google Calendar", url);
}

function addVSCodeTutorial(parent) {
  addButton(parent, "VS Code Tutorial", "https://to.osu.dev/vscode");
}

function addButtonBar(parent) {
  const eventButtons = document.createElement("div");
  eventButtons.classList.add("button-bar");
  parent.appendChild(eventButtons);
  return eventButtons;
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

function addEventButtons(event, parent, now) {
  const eventButtons = addButtonBar(parent, event);

  if (event.date > now) {
    // addRSVP(eventButtons);
    addGoogleCalendar(eventButtons, event);
  }

  if (event.buttons) {
    for (let button of event.buttons) {
      addButton(eventButtons, button.buttonText, button.buttonLink);
    }
  }
}

function addWatermark(parent, event) {
  const watermark = document.createElement("div");
  watermark.classList.add("event-watermark");
  watermark.textContent = event.emoji;
  parent.appendChild(watermark);
}

document.addEventListener('DOMContentLoaded', (e) => {
  loadEvents();
});
