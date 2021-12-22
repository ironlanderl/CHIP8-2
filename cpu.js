class CPU{
    // Screen data
    SCREEN_WIDTH = 64;
    SCREEN_HEIGHT = 32;
    screen = new Uint8Array(this.SCREEN_WIDTH * this.SCREEN_HEIGHT);


    // RAM
    RAM = new Uint8Array(4096);


    // CPU registers
    V = new Uint8Array(16);
    // I?
    I = 0;
    // Program counter
    PC = 0x200;


    // Stack
    STACK_SIZE = 16;
    stack = new Uint16Array(this.STACK_SIZE);
    // Stack pointer
    SP = 0;

    istruzione = "";

    CaricaROM(ROM){
        // La ROM viene caricata in ram a partire dall'indirizzo 0x200
        let j = 0x200;
        for(let i = 0; i < ROM.length; i++){
            this.RAM[j] = ROM[i];
            j++
        }
    }

    CaricaFont(){
        // Il font viene caricato a partire dall'indirizzo 0x50
        let START_INDEX = 0x50;
        let fontset = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];
        for (let i = 0; i < fontset.length; i++){
                this.RAM[START_INDEX + i] = fontset[i];
        }
    }

    Fetch(){
        // Split the instruction in two parts
        let opcode1 = this.RAM[this.PC].toString(16).padStart(2, "0");
        let opcode2 = this.RAM[this.PC + 1].toString(16).padStart(2, "0");
        this.istruzione = opcode1 + opcode2;

        this.PC += 2;
    }










































    constructor(ROM){
        this.CaricaROM(ROM);
        this.CaricaFont();
        debugger;
        this.Fetch();
    }
}