export function createButton(text, className, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = className;
  button.addEventListener('click', onClick);
  return button;
}

export function styleButton(button, styles = {}) {
  Object.assign(button.style, styles);
}
