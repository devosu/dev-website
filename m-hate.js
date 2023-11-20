/**
 * This script will wrap any letters m in a custom element applying a red cross through it
 */


const mHate = {
  excludedTags: ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'LABEL', 'PRE', 'HATE'],
  excludedClasses: [],

  /**
   * Excludes the given tags from being messed with
   * @param {Array[string]} tags 
   */
  excludeTags: (tags) => {
    mHate.excludedTags.push(...tags);
  },
  
  /**
   * Excludes the given classes from being messed with
   * @param {Array[string]} classes 
   */
  excludeClasses: (classes) => {
    mHate.excludedClasses.push(...classes);
  },

  /**
   * Crosses all m's in the document
   */
  crossAllM: () =>{
    mHate.crossIn(document.body);
  },

  /**
   * Recursively crosses all m's in the given element
   * @param {HTMLElement} element
   */
  crossIn: (element) => {
    if (element.nodeType === Node.TEXT_NODE && (element.textContent.includes('m') || element.textContent.includes('M'))) {
      const text = element.textContent;
      // a new tag is introduced to avoid collisions with other
      const newHtml = text.replace(/[mM]/g, '<hate>$&</hate>');
      const newNode = document.createElement('text');
      newNode.innerHTML = newHtml;
      element.replaceWith(newNode);
    } else if (
      !mHate.excludedTags.includes(element.tagName) &&
      !(element.classList && mHate.excludedClasses.some((className) => element.classList.contains(className)))
      ) {
      for (const child of element.childNodes) {
        mHate.crossIn(child);
      }
    }
  }

}

/**
 * Adds styles and calls crossM on the body when the page is loaded
 */
window.addEventListener('load', () => {
  console.log('Starting m-hate.js purge');
  // add style to document
  const style = document.createElement('style');
  style.innerHTML = `
  hate {
    text-decoration: line-through #ff0000bc 0.2em;
  }
  `;
  document.head.appendChild(style);

  // find all m's
  mHate.crossAllM();
});
