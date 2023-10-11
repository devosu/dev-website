/*
 * This script creates a countdown timer
 */

let font,
  numbers = [];
/* this function must be awaited before using the countdown */
async function loadFont(fontURL) {
  try {
    font = await opentype.load(fontURL);
  } catch (e) {
    console.error('There was error while loading the font for countdown', e);
  }
}

let glyphWidth = 0;

/*
 * This function adds a countdown to the given svgElement
 * @param {HTMLElement} svgElement - the svg element to add the countdown to
 * @param {Date} date - the date to count down to
 * @param {number} fontSize - the font size of the countdown in pixels
 * @param {number} fontSpacing - the spacing between the numbers, in multiples of the font size, default is 2
 * @param {boolean} centered - whether the countdown should be centered, default is false
 * @param {function} timeOutCallback - the callback to call when the countdown is finished, optional
 */
async function addCountdown(
  svgElement,
  date,
  fontSize,
  fontSpacing = 2,
  centered = false,
  timeOutCallback = null
) {
  let oldGlyphs = [];
  glyphWidth = font.getAdvanceWidth("0", fontSize) * fontSpacing;

  const interval = setInterval(() => {
    let string = "";
    const now = new Date();

    if (date < now) {
      // countdown is over
      clearInterval(interval);
      if (timeOutCallback) timeOutCallback();
      
    } else {
      const timeLeft = date - now;
      let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      string = makeString(days, hours, minutes, seconds);
    }

    // if centered, calculate the left margin
    let leftMargin = 0;
    if (centered) {
      let fontWidth = string.length * glyphWidth;
      leftMargin = (svgElement.clientWidth - fontWidth) / 2;
    }

    // convert the string to glyphs
    const newGlyphs = string.split("").map((char, i) => {
      return font.charToGlyph(char);
    });

    // get the path element
    const pathElement = svgElement.querySelector("path");
    const oldPath = pathElement.getAttribute("d");

    // if there is no old path, set the path to the new path
    if (!oldPath) {
      const newPath = glyphsToPath(newGlyphs, fontSize, leftMargin);
      pathElement.setAttribute("d", newPath);
      oldGlyphs = newGlyphs;
      return;
    }

    const interpolators = [];
    // copy the left margin because we will increment it
    let leftMarginCursor = leftMargin;
    for (let i = 0; i < newGlyphs.length; i++) {
      // get the interpolator for this glyph
      interpolators.push(
        makeInterpolator(oldGlyphs[i], newGlyphs[i], leftMarginCursor, fontSize)
      );

      // increment the left margin
      leftMarginCursor += glyphWidth;
    }

    let startTime = null;
    const animationLength = 200;
    const animation = (time) => {
      // first frame
      if (!startTime) startTime = time;
      // animation progress from 0 to 1
      animT = (time - startTime) / animationLength;
      // interpolate each glyph and join them together
      const newPath = interpolators
        .map((interpolator) => interpolator(animT))
        .join(" ");
      pathElement.setAttribute("d", newPath);

      if (animT < 1) {
        // keep going until transition is complete
        requestAnimationFrame(animation);
      } else {
        // transition is complete, the element path is now the new path
        pathElement.setAttribute(
          "d",
          glyphsToPath(newGlyphs, fontSize, leftMargin)
        );
      }
    };

    // start the animation
    requestAnimationFrame(animation);
    // save the new glyphs for the next frame
    oldGlyphs = newGlyphs;
  }, 1000);
}

function makeString(days, hours, minutes, seconds) {
  // only show occuppied time units
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}`;
  }
}

function makeInterpolator(oldGlyph, newGlyph, leftMarginCursor, fontSize) {
  // if there is no glyph or the old glyph is the same as the new glyph, just add the new glyph
  if (!oldGlyph || !newGlyph || oldGlyph === newGlyph) {
    const newPath = newGlyph
      .getPath(leftMarginCursor, fontSize + 1, fontSize)
      .toPathData();
    // fake interpolator that just returns the new path
    return () => newPath;
    // if the old glyph is different from the new glyph, interpolate between them
  } else {
    const oldPath = oldGlyph
      .getPath(leftMarginCursor, fontSize + 1, fontSize)
      .toPathData();
    const newPath = newGlyph
      .getPath(leftMarginCursor, fontSize + 1, fontSize)
      .toPathData();
    return flubber.interpolate(oldPath, newPath, { maxSegmentLength: 1 });
  }
}

function glyphsToPath(glyphs, fontSize, leftMargin = 0) {
  let path = "";
  for (const glyph of glyphs) {
    path +=
      glyph.getPath(leftMargin, fontSize + 1, fontSize).toPathData() + " ";
    leftMargin += glyphWidth;
  }
  return path;
}
