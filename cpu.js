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

    opcode = 0x0000;

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
        this.opcode = this.RAM[this.PC] | this.RAM[this.PC + 1];
        this.PC += 2;
    }


    Execute(){
        // Decode
        let a = (this.opcode & 0xF000) >> 12;
        let x = (this.opcode & 0x0F00) >> 8;
        let y = (this.opcode & 0x00F0) >> 4;
        let n = this.opcode & 0x000F;
        let nn = this.opcode & 0x00FF;
        let nnn = this.opcode & 0x0FFF;
        
        // Execute
    }





































    constructor(ROM){
        this.CaricaROM(ROM);
        this.CaricaFont();
        debugger;
        this.Fetch();
        this.Execute();
    }
}