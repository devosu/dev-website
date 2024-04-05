/*
* This script shuffles the photosOfTheDay.json file
*/

import file from 'data/photosOfTheDay.json';

// shuffle the array
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // while there remain elements to shuffle
  while (0 !== currentIndex) {
    // pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // and swap it with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue
  }

  return array;
}

// shuffle the array
const shuffled = shuffle(file);

// save the shuffled array to a new file
import { writeFile } from 'fs';
writeFile('js/photosOfTheDayShuffled.json', JSON.stringify(shuffled), (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});