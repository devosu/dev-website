/*
 * This script loads the events.json file and displays the events on the page
 */

async function loadEvents() {
  await loadFont("./assets/fonts/LibreFranklin-Regular.ttf");
  const eventsBox = document.getElementById("events-box");
  const eventsFutureSwitch = document.getElementById("events-future-switch");
  const eventsFutureSwitchInput = eventsFutureSwitch.querySelector("input");

  const eventsReq = await fetch("./events.json");
  let events = (await eventsReq.json()).events;

  events = events.filter((event) => {
    return !event.hide && (!event.publishOn || new Date(event.publishOn) <= new Date());
  });

  const pastEvents = events.filter((event) => {
    return new Date(event.date) < new Date();
  }).reverse();

  const futureEvents = events.filter((event) => {
    return new Date(event.date) > new Date();
  });

  eventsFutureSwitch.onchange = () => {
    updateEvents(eventsFutureSwitchInput, eventsBox, pastEvents, futureEvents);
    window.navigator.vibrate(10);
  };

  updateEvents(eventsFutureSwitchInput, eventsBox, pastEvents, futureEvents);
}

function updateEvents(eventsFutureSwitchInput, eventsBox, pastEvents, futureEvents) {
  eventsBox.innerHTML = "";
  clearCountdowns();
  if (eventsFutureSwitchInput.checked) {
    for (let event of futureEvents) {
      addEvent(event, eventsBox);
    }
  } else {
    for (let event of pastEvents) {
      addEvent(event, eventsBox);
    }
  }
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
  
  const date = new Date(event.date);
  const now = new Date();
  console.log(date, now)

  addDate(date, eventInfo);
  
  if (date > now) {
    addStartsIn(date, eventInfo);
  }
  
  addLocation(event, eventInfo);
  
  addButtons(event, eventInfo, date, now);


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

function addName(event, parent) {
  const eventName = document.createElement("h3");
  eventName.textContent = event.name;
  parent.appendChild(eventName);
}

function addDescription(event, parent) {
  if (event.description) {
    const eventDescription = document.createElement("p");
    eventDescription.innerHTML = event.description;
    parent.appendChild(eventDescription);
  }
}

function addDate(date, parent) {
  const eventDate = document.createElement("p");
  eventDate.textContent =
    `📆 ${date.toDateString()}, ${date.toLocaleTimeString()}`;
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
  const eventRSVP = document.createElement("a");
  eventRSVP.href = "https://go.tosu.dev/rsvp";
  eventRSVP.target = "_blank";
  eventRSVP.textContent = "RSVP";
  parent.appendChild(eventRSVP);
}

function addGoogleCalendar(parent, event, date) {
  const url = new URL("https://www.google.com/calendar/render");
  url.searchParams.append("action", "TEMPLATE");

  let name = event.name + " at DEV";
  if (event.emoji) name = event.emoji + " " + name;
  url.searchParams.append("text", name);

  const endDate = new Date(date);
  endDate.setHours(endDate.getHours() + 1);

  //format date as YYYYMMDDTHHmmSSZ
  const dateFormatted = date.toISOString().replace(/[-:]/g, "").replace(/\.\d\d\d/g, "");
  const endDateFormatted = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d\d\d/g, "");

  url.searchParams.append("dates", dateFormatted + "/" + endDateFormatted);
  url.searchParams.append("location", event.location + " (Check https://tosu.dev for updates)");
  url.searchParams.append("details", "Check https://tosu.dev for latest updates! \n" + event.description);

  const eventGoogleCalendar = document.createElement("a");
  eventGoogleCalendar.href = url;
  eventGoogleCalendar.target = "_blank";
  eventGoogleCalendar.textContent = "Google Calendar";
  parent.appendChild(eventGoogleCalendar);
}

function addButtons(event, parent, date, now) {
  const eventButtons = document.createElement("div");
  eventButtons.classList.add("button-bar");

  if (date > now) {
    addRSVP(eventButtons);
    addGoogleCalendar(eventButtons, event, date);
  }

  if (event.buttons) {
    for (let button of event.buttons) {
      const eventButton = document.createElement("a");
      eventButton.href = button.buttonLink;
      eventButton.target = "_blank";
      eventButton.textContent = button.buttonText;
      eventButtons.appendChild(eventButton);
    }
  }
  parent.appendChild(eventButtons);
}

function addWatermark(parent, event) {
  const watermark = document.createElement("div");
  watermark.classList.add("event-watermark");
  watermark.textContent = event.emoji;
  parent.appendChild(watermark);
}

loadEvents();
