const form = document.querySelector('#img-form');
const imgInput = document.querySelector('#img');
const outputPathSpan = document.querySelector('#output-path');
const filenameSpan = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileAnImage(file)) {
    alertError('Please select an image');
    return;
  }

  // Get original dimensions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = 'block'; // shows the form
  filenameSpan.innerText = file.name;
  outputPathSpan.innerText = path.join(os.homedir(), 'imageResizer');
}

// make sure file is image
function isFileAnImage(file) {
  const acceptedImagesTypes = ['image/gif', 'image/png', 'image/jpeg'];

  return file && acceptedImagesTypes.includes(file['type']);
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000, // 5s
    close: false, // no close button
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
    }
  });
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000, // 5s
    close: false, // no close button
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    }
  });
}

imgInput.addEventListener('change', loadImage);