/**
 * This script will wrap any letters m in a custom element applying a red cross through it
 */

const excludedTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'LABEL', 'HATE'];
const excludedClasses = [];

/**
 * Excludes the given tags from being messed with
 * @param {Array[string]} tags 
 */
function excludeTags(tags) {
  excludedTags.push(...tags);
}

/**
 * Excludes the given classes from being messed with
 * @param {Array[string]} classes 
 */
function excludeClasses(classes) {
  excludedClasses.push(...classes);
}

/**
 * Crosses all m's in the document
 */
function crossAllM() {
  crossM(document.body);
}

// --- Stuff below is private ---

/**
 * Adds styles and calls crossM on the body when the page is loaded
 */
window.onload = () => {
  console.log('done');
  // add style to document
  const style = document.createElement('style');
  style.innerHTML = `
  hate {
    text-decoration: line-through red 0.2em;
  }
  `;
  document.head.appendChild(style);

  // find all m's
  crossAllM();
}

/**
 * Recursively crosses all m's in the given element
 * @param {HTMLElement} element
 */
function crossM(element) {
  if (element.nodeType === Node.TEXT_NODE && element.textContent.includes('m')) {
    const text = element.textContent;
    // a new tag is introduced to avoid collisions with other
    const newHtml = text.replace(/m/g, '<hate>m</hate>');
    const newNode = document.createElement('text');
    newNode.innerHTML = newHtml;
    element.replaceWith(newNode);
    console.log(text.wholeText)
  } else if (!excludedTags.includes(element.tagName) && !excludedClasses.some((className) => element.classList.contains(className))) {
    for (const child of element.childNodes) {
      crossM(child);
    }
  }
}