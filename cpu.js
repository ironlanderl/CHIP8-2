class CPU{
    // Screen data
    SCREEN_WIDTH = 64;
    SCREEN_HEIGHT = 32;
    schermo = this.CreaMatrice();


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
    /**@type {Array} */
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

    /*MainLoop(){
        this.Fetch();
        this.Execute();
    }*/

    Fetch(){
        // Split the instruction in two parts
        // La prima parte deve essere spostata a sinistra di 8 bit
        this.opcode = this.RAM[this.PC] << 8 | this.RAM[this.PC + 1];
        this.PC += 2;
    }


    Execute(){
        // Decode
        let a = (this.opcode & 0xF000) >> 12;
        let X = (this.opcode & 0x0F00) >> 8;
        let Y = (this.opcode & 0x00F0) >> 4;
        let N = this.opcode & 0x000F;
        let NN = this.opcode & 0x00FF;
        let NNN = this.opcode & 0x0FFF;

        // Execute

        switch (a) {
            case 0:
                if (this.opcode == 0x00E0) this.screen = new Uint8Array(this.SCREEN_HEIGHT * this.SCREEN_WIDTH)
                if (this.opcode == 0x00EE){
                    this.PC = this.stack[this.SP];
                    this.SP--;
                }
                break;

            case 1:
                this.PC = NNN;
                break;

            case 2:
                this.stack[this.SP];
                this.SP++;
                this.PC = NNN;
                break;
            case 3:
                if (this.V[X] == NN)
                {
                    this.PC += 2;
                }
                break;
            case 4:
                if (this.V[X] != NN)
                {
                    this.PC += 2;
                }
                break;
            case 5:
                if (this.V[X] == this.V[Y])
                {
                    this.PC += 2;
                }
                break;
            case 6:
                this.V[X] = NN;
                break;
            case 7:
                this.V[X] += NN;
                break;
            case 8:
                switch (N)
                {
                    case 0:
                        this.V[X] = this.V[Y];
                        break;
                    case 1:
                        this.V[X] = this.V[X] | this.V[Y];
                        break;
                    case 2:
                        this.V[X] = this.V[X] & this.V[Y];
                        break;
                    case 3:
                        this.V[X] = this.V[X] ^= this.V[Y];
                        break;
                    case 4:
                        // Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there is not.
                        this.V[0xF] = (this.V[X] + this.V[Y] > 255) ? 1 : 0;
                        this.V[X] += this.V[Y];
                        break;
                    case 5:
                        // VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there is not.
                        this.V[0xF] = (this.V[X] > this.V[Y]) ? 0 : 1;
                        this.V[X] -= this.V[Y];
                        break;
                    case 6:
                        // Save LSB
                        this.V[0xF] = this.V[X] & 1;
                        // Move V[X] to the right
                        this.V[X] = this.V[X] >>> 1
                        break;

                    default:
                        console.log("Unkown OPCODE: " + this.opcode.toString(16));
                        break;
                }
                break;





            case 0xA:
                this.I = NNN;
                break;

            case 0xD:
                //debugger;
                // Prendo le coordinate dove disegnare
                let x = this.V[X] % this.SCREEN_WIDTH
                let y = this.V[Y] % this.SCREEN_HEIGHT
                // Resetto V[0xF]
                // Segna se un bit è stato sovrascritto
                this.V[0xF] = 0

                // altezza
                for (let i = 0; i < N; i++)
                {
                    // prendo i dati per la riga 'i' dello sprite
                    //let data = this.RAM[this.I + i];
                    // scrivo allo schermo in base alla lunghezza fissa di 8bit per riga
                    for (let j = 0; j < 8; j++)
                    {
                        // Controllo se esco dallo schermo
                        if (x + j < this.SCREEN_WIDTH)
                        {
                            let data = this.RAM[this.I + i] & (1 << (7 - j)) ? 1 : 0
                            // controllo se il bit è 1
                            if (data)
                            {
                                if (this.schermo[y + i][x + j] == false)
                                {
                                    this.schermo[y + i][x + j] = true;
                                }
                                else
                                {
                                    this.schermo[y + i][x + j] = false;
                                    this.V[0xF] = 0x1;
                                }
                            }
                        }
                    }
                }
                break;

            default:
                console.log("Unkown OPCODE: " + this.opcode.toString(16));
                break;
        }
    }





































    constructor(ROM){
        this.CaricaROM(ROM);
        this.CaricaFont();
        //debugger;
        this.Fetch();
        this.Execute();
    }

    // Create a function that creates a matrix with SCREEN_HEIGHT rows and SCREEN_WIDTH columns
    // Each cell is a boolean value
    // The function should return a matrix
    CreaMatrice(){
        let tmp = new Array(this.SCREEN_HEIGHT);
        for (let i = 0; i < this.SCREEN_HEIGHT; i++)
        {
            tmp[i] = new Array(this.SCREEN_WIDTH);
        }

        // Set all the matrix cells to false
        for (let i = 0; i < this.SCREEN_HEIGHT; i++)
        {
            for (let j = 0; j < this.SCREEN_WIDTH; j++)
            {
                tmp[i][j] = false;
            }
        }


        return tmp;
    }

}