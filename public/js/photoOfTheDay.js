// const turingPhoto = document.getElementById('turingPhoto');

// const day = new Date().getDate();
// const month = new Date().getMonth();
// const year = new Date().getFullYear();

// const photoIndex = (day + month + year) % 16;

// turingPhoto.src = `./assets/turing/alan (${photoIndex}).jpg`;

const photoOfTheDayName = document.getElementById('photoOfTheDayName');
const photoOfTheDayPhoto = document.getElementById('photoOfTheDayPhoto');
const photoOfTheDayDescription = document.getElementById('photoOfTheDayDescription');
const photoOfTheDaySource = document.getElementById('photoOfTheDaySource');

async function setPhoto() {
    const photos = await (await fetch('js/photosOfTheDayShuffled.json')).json();

    const day = new Date().getTime();
    const oneMinute = 1000 * 60;
    const oneDay = 60 * 24;
    const today = ((day / oneMinute) - new Date().getTimezoneOffset()) / oneDay;
    // console.log(day, today, new Date().getTimezoneOffset());

    const photoIndex = Math.floor(today) % photos.length;

    const photo = photos[photoIndex];

    photoOfTheDayName.innerHTML = photo.name;
    photoOfTheDayPhoto.src = photo.photo;
    photoOfTheDayPhoto.alt = photo.name;
    photoOfTheDayDescription.innerHTML = photo.description;
    photoOfTheDaySource.href = photo.source;
}

setPhoto();