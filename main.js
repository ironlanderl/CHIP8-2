var ROM = []
var cpu;
var animationID
var canvas;
/**@type {CanvasRenderingContext2D} */
var ctx;

const SCREEN_WIDTH = 64;
const SCREEN_HEIGHT = 32;

var input = EmptyBoolArray(16);
const mapping = new Array(  "1", "2", "3", "4",
                            "Q", "W", "E", "R",
                            "A", "S", "D", "F",
                            "Z", "X", "C", "V");


// Function to load the ROM from the input tag with id "file" to the ROM uint8array
function CaricaROM() {
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.onload = function () {
        var data = reader.result;
        ROM = new Uint8Array(data);
        cpu = new CPU(ROM);
        setInterval(MainLoop, 1 / 500 * 1000);
        setInterval(cpu.Timers, 1 / 60 * 1000);
        animationID = window.requestAnimationFrame(DisegnaSchermo);
    };
    reader.readAsArrayBuffer(file);
}

function MainLoop(){
    cpu.PrendiInput(input);
    cpu.Fetch();
    cpu.Execute();
}

function DisegnaSchermo(){
    // Prendo lo schermo
    let schermo = cpu.schermo;

    // Pulisco il canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Itero per disegnarlo
    for (let i = 0; i < SCREEN_HEIGHT; i++)
    {
        for (let j = 0; j < SCREEN_WIDTH; j++)
        {
            if (schermo[i][j])
                ctx.fillRect(j, i, 1, 1)
        }
    }

    animationID = window.requestAnimationFrame(DisegnaSchermo);
}

// Init function to get the canvas
function init(){
    canvas = document.getElementById("screen")
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    // Ingrandiso
    ctx.scale(10,10);

    // Event Handel per i controlli
    document.body.addEventListener("keydown", ev => InputDown(ev));
    document.body.addEventListener("keyup", ev => InputUp(ev));
}

function InputDown(/**@type {KeyboardEvent} */ ev) {
    for (let i = 0; i < mapping.length; i++){
       if (mapping[i] === ev.key.toUpperCase()){
           input[i] = true;
           console.log(input);
           return;
       }
    }
}

function InputUp(/**@type {KeyboardEvent} */ ev) {
    for (let i = 0; i < mapping.length; i++){
       if (mapping[i] === ev.key.toUpperCase()){
           input[i] = false;
           console.log(input);
           return;
       }
    }
}

function EmptyBoolArray(size) {
    let array = new Array(size);
    for (let i = 0; i < size; i++){
        array[i] = false;
    }
    return array;
}