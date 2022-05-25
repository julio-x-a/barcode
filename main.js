const d = document;
const list = d.getElementById('list');

window.onload = () => {
  detect();
};

async function detect() {
  const barcodeDetector = new BarcodeDetector();
  const list = document.getElementById('list');
  let itemsFound = [];
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
  });

  const video = document.getElementById('camera');
  video.srcObject = mediaStream;
  video.autoplay = true;

  list.before(video);

  function render() {
    barcodeDetector
      .detect(video)
      .then((barcodes) => {
        barcodes.forEach((barcode) => {
          if (!itemsFound.includes(barcode.rawValue)) {
            navigator.vibrate(200);
            itemsFound.push(barcode.rawValue);
            const li = document.createElement('li');
            li.innerHTML = barcode.rawValue;
            list.appendChild(li);
          }
        });
      })
      .catch(alert(error));
  }

  (function renderLoop() {
    requestAnimationFrame(renderLoop);
    render();
  })();
}

// d.addEventListener('DOMContentLoaded', async (e) => {
//   const mediaStream = await navigator.mediaDevices.getUserMedia({
//     video: { facingMode: 'environment' },
//   });
//   const video = document.createElement('video');
//   video.srcObject = mediaStream;
//   video.autoplay = true;
//   list.before(video);
// });
