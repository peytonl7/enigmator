/*
Grid + clues for crossword.
*/

import { useState, useEffect, useCallback } from 'react';
import { isAlphanumeric, getNextLabels, getNextClues } from '../utils';

function Square({ value, onSquareClick, squareClass, label }) {
  return (
    <button className={squareClass} onClick={onSquareClick}> 
      <span className={"square-label"}>{value === "." ? "" : label}</span>
      <span className={"square-content"}>{value === "." ? "" : value}</span>
    </button>
  );
}

function Board({ squares, labels, clues, setClues, currentSquare, currentDirection, onModify, 
                 height, width, sizeChangerSelected }) {
  function handleClick(i) {
    let nextDirection = currentDirection;
    if (i === currentSquare) {
        nextDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    onModify(squares, labels, i, nextDirection);
  }

  const handleKeyPress = useCallback((event) => {
    const nextSquares = squares.slice();
    let nextSquare = currentSquare;
    let nextDirection = currentDirection;
    let nextLabels = labels;
    let nextClues = clues;
    if (!sizeChangerSelected) {
      // Arrow key case
      if (event.key.substring(0, 5) === "Arrow") {
        event.preventDefault();
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          nextDirection = "vertical";
          if (currentDirection === "vertical" || squares[currentSquare] === ".") {
            if (event.key === "ArrowUp" && currentSquare >= width) {
              nextSquare = currentSquare - width;
            } else if (event.key === "ArrowDown" && currentSquare / width < height - 1) {
              nextSquare = currentSquare + width;
            }
          }
        } else {
            nextDirection = "horizontal";
            if (currentDirection === "horizontal" || squares[currentSquare] === ".") {
              if (event.key === "ArrowLeft" && currentSquare % width !== 0) {
                nextSquare = currentSquare - 1;
              } else if (event.key === "ArrowRight" && (currentSquare + 1) % width !== 0) {
                nextSquare = currentSquare + 1;
              }
            }
        }
      // Backspace key case
      } else if (event.key === "Backspace") {
        nextSquares[currentSquare] = "";
        if (squares[currentSquare] === ".") {
          nextLabels = getNextLabels(nextSquares, height, width);
          nextClues = getNextClues(nextLabels, clues);
        }
        if (currentDirection === "horizontal") {
          if (currentSquare % width !== 0 && squares[currentSquare - 1] !== ".") {
            nextSquare = currentSquare - 1;
          }
        } else if (currentSquare >= width && squares[currentSquare - width] !== ".") {
            nextSquare = currentSquare - width;
        }
      // Period character case
      } else if (event.key === ".") {
          nextSquares[currentSquare] = nextSquares[currentSquare] === event.key ? "" : event.key;
          nextSquare = currentSquare;
          nextLabels = getNextLabels(nextSquares, height, width);
          nextClues = getNextClues(nextLabels, clues);
      // Alphanumeric character case
      } else if (event.key.length === 1 && isAlphanumeric(event.key)) {
          nextSquares[currentSquare] = event.key.toUpperCase();
          if (squares[currentSquare] === ".") {
            nextLabels = getNextLabels(nextSquares, height, width);
            nextClues = getNextClues(nextLabels, clues);
          }
          if (currentDirection === "horizontal") {
            if ((currentSquare + 1) % width !== 0 && squares[currentSquare + 1] !== ".") {
              nextSquare = currentSquare + 1;
            }
          } else if (currentSquare / width < height - 1 && squares[currentSquare + width] !== ".") {
              nextSquare = currentSquare + width;
          }
      } 
    }
    onModify(nextSquares, nextLabels, nextSquare, nextDirection);
  }, [currentDirection, squares, labels, clues, nextClues, currentSquare, onModify, 
      width, height, sizeChangerSelected])

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyPress);
    return () => {
        document.body.removeEventListener('keydown', handleKeyPress);
    }
  }, [handleKeyPress])
  

  let [lowerBound, upperBound] = [currentSquare, currentSquare]
  if (currentDirection === "horizontal") {
    while (squares[lowerBound] !== "." && Math.floor(lowerBound / width) === Math.floor(currentSquare / width)) {
      lowerBound -= 1;
    }
    while (squares[upperBound] !== "." && Math.floor(upperBound / width) === Math.floor(currentSquare / width)) {
      upperBound += 1;
    }
  } else {
    while (squares[lowerBound] !== "." && lowerBound >= 0) {
      lowerBound -= width;
    }
    while (squares[upperBound] !== "." && upperBound < squares.length) {
      upperBound += width;
    }
  }

  function getSquareClass(ind, value) {
    let square_class = "square";
    if (ind === currentSquare) {
      if (value === ".") {
        square_class = "dark-gray square";
      } else {
        square_class = "gray square";
      }
    } else if (value === ".") {
        square_class = "black square";
    } else if (squares[currentSquare] !== "." && ind > lowerBound && ind < upperBound) {
        if (currentDirection === "horizontal" || (ind % width === currentSquare % width)) {
          square_class = "light-gray square";
        }
    }
    return square_class;
  }

  let inds = []
  for (let i = 0; i < height; i++) {
    inds.push([...Array(width).keys()].map(num => num + i * width))
  }

  return (
    <div id="grid-container">
      {inds.map(row => 
        <div className="board-row">
          {row.map(ind => 
            <Square value={squares[ind]} onSquareClick={() => handleClick(ind)} 
                    squareClass={getSquareClass(ind, squares[ind])} label={labels[ind]}/>
          )}
        </div>
      )}
    </div>
  );
}

function ClueEntry({ label, clue, setClue }) {
  return (
    <div className="clue-entry">
      {label}
      <input className="clue" value={clue} onInput={setClue}></input>
    </div>
  );
}

function Clues({ clues, setClues }) {
  function setClue( direction, number, newValue ) {
    const newClues = { ...clues };
    newClues[direction].set(number, newValue);
    setClues(newClues);
  }
  return (
    <div className="clues-container">
      Across
      {}
      Down
      {}
    </div>
  );
}

export function Grid({ height, width, currentSquares, setCurrentSquares, labels, setLabels, 
                       sizeChangerSelected, clues, setClues }) {
  const [currentSquare, setCurrentSquare] = useState(0);
  const [currentDirection, setCurrentDirection] = useState('horizontal');
  const [currentClues, setCurrentClues] = useState([1, 1]);

  function handleModify(nextSquares, nextLabels, nextSquare, nextDirection) {
    setCurrentSquares(nextSquares);
    setCurrentSquare(nextSquare);
    setCurrentDirection(nextDirection);
    setLabels(nextLabels);
  }

  return (
    <div className="grid" style={{width: 47 * width}}>
      <Board squares={currentSquares} labels={labels} clues={clues} setClues={setClues} 
      currentSquare={currentSquare} currentDirection={currentDirection} onModify={handleModify} 
      height={height} width={width} sizeChangerSelected={sizeChangerSelected} />
      <Clues clues={clues} setClues={setClues}/>
    </div>
  );
}