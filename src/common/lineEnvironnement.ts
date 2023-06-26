import { Size } from 'electron';

interface ILineEnvironnement {
  LineYPosition: number;

  LineLength: number;

  LetterSpacing: number;

  LetterWidth: number;
}

class LineEnvironnement implements ILineEnvironnement {
  LineYPosition: number = -1;

  LineLength: number = -1;

  LetterWidth: number;

  LetterSpacing: number = -1;

  ScreenXRes: number = -1;

  ScreenYRes: number = -1;

  ScreenXSize: number = -1;

  ScreenYSize: number = -1;

  LinePosition: Array<number> = new Array(3);

  getLayout(AppWindow: Size, RealScreen: Size, ScreenSize: number) {
    const ratio = RealScreen.width / RealScreen.height;
    const screenY: number = (ScreenSize * 25.4) / Math.sqrt(ratio ** 2 + 1.0);
    const screenX = ratio * screenY;
    this.LineLength = (160.0 * AppWindow.width) / screenX;
    this.LineYPosition = AppWindow.height / 2.0;
    this.LetterSpacing = (10.0 * AppWindow.width) / screenX - this.LetterWidth;
    this.ScreenXRes = AppWindow.width;
    this.ScreenYRes = AppWindow.height;
    this.ScreenXSize = screenX;
    this.ScreenYSize = screenY;
    this.LinePosition[0] = (this.ScreenXRes * 20.0) / this.ScreenXSize; // = 2cm in pixel
    this.LinePosition[1] = this.ScreenXRes / 2.0 - this.LineLength / 2.0; // middle of screen - line length/2
    this.LinePosition[2] =
      this.ScreenXRes -
      this.LineLength -
      (this.ScreenXRes * 20.0) / this.ScreenXSize; // 2cm from right screen edge in px
  }

  constructor(letterWidth: number) {
    this.LetterWidth = letterWidth;
  }
}

export { LineEnvironnement, ILineEnvironnement };
