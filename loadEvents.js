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
  });
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
  
  addName(event, eventInfo);
  
  addDescription(event, eventInfo);
  
  const date = new Date(event.date);
  
  addDate(date, eventInfo);

  addStartsIn(date, eventInfo);
  
  addLocation(event, eventInfo);
  
  addButton(event, eventInfo);

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
    "📆 " + date.toDateString() + ", " + date.toLocaleTimeString();
  parent.appendChild(eventDate);
}

function addStartsIn(date, parent) {
  if (date > new Date()) {
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
}

function addLocation(event, parent) {
  if (event.location) {
    const eventLocation = document.createElement("p");
    eventLocation.textContent = "📍 " + event.location;
    parent.appendChild(eventLocation);
  }
}

function addButton(event, parent) {
  if (event.buttonText && event.buttonLink) {
    const eventButton = document.createElement("a");
    eventButton.href = event.buttonLink;
    eventButton.target = "_blank";
    eventButton.textContent = event.buttonText;
    parent.appendChild(eventButton);
  }
}

loadEvents();
