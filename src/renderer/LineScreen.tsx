import { Container, Typography } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { LineEnvironnement } from '../common/lineEnvironnement';
import { LineProvider } from '../common/lineProvider';
import { Line } from '../common/Line';

function LinePolygon({
  lineEnv,
  currentLine,
}: {
  lineEnv: LineEnvironnement;
  currentLine: Line;
}) {
  return (
    <div
      style={{
        top: lineEnv.LineYPosition - 3 / 2,
        left: lineEnv.LinePosition[currentLine.Position - 1],
        height: 3,
        width: lineEnv.LineLength,
        position: 'absolute',
        backgroundColor: 'black',
      }}
    />
  );
  /* return (
    <svg
      height="100%"
      width="100%"
      style={{ padding: 0, margin: 0, position: 'absolute', top: 0, left: 0 }}
    >
      <polygon
        points={points
          .flatMap((point) => {
            return `${point.x},${point.y}`;
          })
          .join(' ')}
        style={{ stroke: 'black', strokeWidth: 4 }}
      />
    </svg>
  ); */
}

const getContext = () => {
  const fragment: DocumentFragment = document.createDocumentFragment();
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  fragment.appendChild(canvas);
  return canvas.getContext('2d') as CanvasRenderingContext2D;
};

const getTextWidth = (currentText: string | string[], font: string) => {
  const context = getContext();
  context.font = font;

  if (Array.isArray(currentText)) {
    return Math.max(...currentText.map((t) => context.measureText(t).width));
  }
  const metrics = context.measureText(currentText);
  return metrics.width;
};

function Letter({
  letter,
  position,
}: {
  letter: string;
  position: { x: number; y: number };
}) {
  return (
    <Typography
      style={{
        fontFamily: 'CONSOLAS',
        fontWeight: 'bold',
        fontSize: 30,
        position: 'absolute',
        display: 'block',
        top: position.y,
        left: position.x,
        margin: 0,
        padding: 0,
      }}
    >
      {letter}
    </Typography>
  );
}

function LineScreen() {
  const [lineProvider, setLineProvider] = useState<LineProvider>();
  const [lineEnv, setLineEnv] = useState<LineEnvironnement>();
  const [generationType, setGenerationtype] = useState(-1);

  const [currentLine, setCurrentLine] = useState<Line>();

  const [maxLineCount, setMaxLineCount] = useState(-1); // loop

  const [currentLineCount, setLineCounter] = useState(0);

  const handleKeypress = useCallback(
    (event: KeyboardEvent) => {
      if (!lineProvider) return;
      switch (event.code) {
        case 'Escape': // nothing, handle in main
          break;
        case 'ArrowLeft': // go back
          if (currentLine) {
            setCurrentLine(undefined);
          } else {
            const t = lineProvider.getPreviousLine();
            setCurrentLine(t);
            window.electron.ipcRenderer.sendMessage('current-line', t);
            if (currentLineCount > 1) setLineCounter(currentLineCount - 1);
          }
          break;
        case 'ArrowRight': // go forward
        default:
          if (currentLineCount >= maxLineCount)
            window.electron.ipcRenderer.sendMessage('runmode-change', false);
          if (currentLine) {
            setCurrentLine(undefined);
          } else {
            const t = lineProvider.getNextLine();
            setCurrentLine(t);
            window.electron.ipcRenderer.sendMessage('current-line', t);
            setLineCounter(currentLineCount + 1);
          }
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLine, lineProvider]
  );

  useEffect(() => {
    if (
      generationType !== undefined &&
      generationType !== null &&
      generationType !== -1
    )
      setLineProvider(new LineProvider(generationType));
  }, [generationType]);

  useEffect(() => {
    if (!lineEnv || !lineProvider) {
      window.electron.ipcRenderer
        .invoke('get-runtime-settings', {
          size: getTextWidth('H', '30px CONSOLAS bold'),
        })
        .then((data) => {
          if (data) {
            setLineEnv(data.env);
            setGenerationtype(data.generationMode);
            setMaxLineCount(data.count);
          }
          window.electron.ipcRenderer.sendMessage('runmode-change', true);
          return 1;
        })
        .catch((ex) => console.log(ex));
    }

    window.addEventListener('keydown', handleKeypress);

    return () => {
      window.removeEventListener('keydown', handleKeypress);
    };
  }, [handleKeypress, lineEnv, lineProvider]);

  if (!lineEnv || !lineProvider)
    return (
      <Container
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#E8E8E8',
          maxWidth: 'unset',
        }}
      >
        <Typography>Loading</Typography>
      </Container>
    );

  if (!currentLine)
    return (
      <Container
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#E8E8E8',
          maxWidth: 'unset',
        }}
      />
    );

  return (
    <Container
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#E8E8E8',
        maxWidth: 'unset',
      }}
    >
      <LinePolygon lineEnv={lineEnv} currentLine={currentLine} />
      {currentLine &&
        currentLine.Letters.flatMap((letter, index) => {
          return (
            <Letter
              key={`letter_${letter}_${index}`}
              letter={letter}
              position={{
                x:
                  lineEnv.LinePosition[currentLine.Position - 1] -
                  lineEnv.LetterWidth / 2 +
                  (lineEnv.LetterSpacing + lineEnv.LetterWidth) * index,
                y: lineEnv.LineYPosition,
              }}
            />
          );
        })}
    </Container>
  );
}

export default LineScreen;
