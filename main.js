const d = document;
const list = d.getElementById('list');
const listDevices = d.getElementById('devices');

window.onload = () => {
  detect();
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        console.log(device.kind + ': ' + device.label + ' id = ' + device.deviceId);
        const li = document.createElement('li');
        li.innerHTML = `${device.kind} : ${device.label} id: ${device.deviceId}`;
        listDevices.appendChild(li);
      });
    })
    .catch(function (err) {
      console.log(err.name + ': ' + err.message);
    });
};

async function detect() {
  const barcodeDetector = new BarcodeDetector();
  const list = document.getElementById('list');
  let itemsFound = [];
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
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

/**
 * It checks if the string is a valid URL.
 * @param s - The string to be tested.
 * @returns A boolean value.
 */
function isUrl(s) {
  var regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}
