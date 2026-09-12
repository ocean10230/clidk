export class SeededRandom {
    private m = 0x80000000;
    private a = 1103515245;
    private c = 12345;
    private state = 0;

    constructor(seed: number) {
      this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }

    Int() {
      this.state = (this.a * this.state + this.c) % this.m;
      return this.state;
    }

    Float() {
      return this.Int() / this.m;
    }

    RangedFloat(min: number, max: number) {
      return this.Float() * (max - min) + min;
    }

    RangedInt(min: number, max: number) {
      return Math.floor(this.Float() * (max - min + 1)) + min;
    }
}