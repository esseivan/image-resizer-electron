const form = document.querySelector('#img-form');
const imgInput = document.querySelector('#img');
const outputPathSpan = document.querySelector('#output-path');
const filenameSpan = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');


function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileAnImage(file)) {
    console.log('Please select an image');
    return;
  }

  console.log('success');
}

// make sure file is image
function isFileAnImage(file) {
  const acceptedImagesTypes = ['image/gif', 'image/png', 'image/jpeg'];

  return file && acceptedImagesTypes.includes(file['type']);
}

imgInput.addEventListener('change', loadImage);