var ROM = []
var cpu;

// Function to load the ROM from the input tag with id "file" to the ROM uint8array
function CaricaROM() {
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.onload = function () {
        var data = reader.result;
        ROM = new Uint8Array(data);
        cpu = new CPU(ROM);
    };
    reader.readAsArrayBuffer(file);
}

// Event Handler per l'input della ROM
const fileInput = document.getElementById("file");
fileInput.onchange = () => {
  const selectedFile = fileInput.files[0];
  console.log(selectedFile);
}