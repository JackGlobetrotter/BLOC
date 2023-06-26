interface ILine {
  Position: number;

  Letters: Array<string>;
}

class Line implements ILine {
  Position: number;

  Letters: Array<string>;

  constructor(letters?: Array<string>, position?: number) {
    if (letters) this.Letters = letters;
    else this.Letters = [];

    if (position) this.Position = position;
    else this.Position = -1;
  }
}

export { Line, ILine };
