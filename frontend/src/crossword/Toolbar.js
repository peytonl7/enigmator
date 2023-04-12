/*
Toolbar for crosswords.
*/
import { useState } from 'react';
import { getNextLabels } from '../utils';

const MAX_HEIGHT = 25;
const MAX_WIDTH = 25;

function SizeChanger({ width, setDimensions, currentSquares, setCurrentSquares,
                       setLabels, setSizeChangerSelected }) {
  const [input, setInput] = useState(Array(2).fill(""));
  function handleDimensionShift(input) {
    const nextDimensions = input.map((i) => parseInt(i));
    let [nextHeight, nextWidth] = nextDimensions;
    if (nextHeight === NaN || nextWidth === NaN) {
      alert("Invalid input (must be integer)!");
    } else if (nextHeight === 0 || nextWidth === 0) {
        alert("Dimensions cannot be 0!");
    } else if (nextHeight > MAX_HEIGHT || nextWidth > MAX_WIDTH) {
        alert("Dimensions cannot exceed 25x25!");
    } else {
        let nextSquares = Array(nextHeight * nextWidth).fill(null);
        for (let i = 0; i < currentSquares.length; i++) {
          const [row, col] = [Math.floor(i / width), i % width];
          if (row < nextHeight && col < nextWidth) {
            nextSquares[row * nextWidth + col] = currentSquares[i]
          }
        }
        let nextLabels = getNextLabels(nextSquares, nextHeight, nextWidth);
        setDimensions(nextDimensions);
        setCurrentSquares(nextSquares);
        setLabels(nextLabels);
    }

  }

  return (
    <span>
    <input id={"height-changer"} className={"size-changer"} value={input[0]} 
           onFocus={(e) => setSizeChangerSelected(true)} 
           onBlur={(e) => setSizeChangerSelected(false)}
           onInput={(e) => setInput([e.target.value, input[1]])}/>
     X 
    <input id={"width-changer"} className={"size-changer"} value={input[1]} 
           onFocus={(e) => setSizeChangerSelected(true)} 
           onBlur={(e) => setSizeChangerSelected(false)}
           onInput={(e) => setInput([input[0], e.target.value])}/>
    <button onClick={() => handleDimensionShift(input)}>Resize</button>
    </span>
  );
}

export function Toolbar({ dimensions, setDimensions, currentSquares, setCurrentSquares, 
                          labels, setLabels, sizeChangerSelected, setSizeChangerSelected,
                          clues }) {
  return (
    <div>
      <SizeChanger width={dimensions[1]} setDimensions={setDimensions} currentSquares={currentSquares} 
                   setCurrentSquares={setCurrentSquares} setLabels={setLabels}
                   setSizeChangerSelected={setSizeChangerSelected} />
    </div>
  );
}