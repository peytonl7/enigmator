/*
Crossword application. (Grid + toolbar)
*/

import { useState } from 'react';
import { Grid } from './Grid.js';
import { Toolbar } from './Toolbar.js';
import { getNextLabels, getNextClues } from '../utils.js';

const DEFAULT_HEIGHT = 15;
const DEFAULT_WIDTH = 15;

export default function Crossword() {
  const [dimensions, setDimensions] = useState([DEFAULT_HEIGHT, DEFAULT_WIDTH]);
  const [currentSquares, setCurrentSquares] = useState(Array(dimensions[0] * dimensions[1]).fill(null));
  const [labels, setLabels] = useState(getNextLabels(currentSquares, dimensions[0], dimensions[1]));
  const [clues, setClues] = useState(getNextClues(labels, { "a": new Map(), "d": new Map() }));
  const [sizeChangerSelected, setSizeChangerSelected] = useState(false);

  return (
    <div>
      <Toolbar dimensions={dimensions} setDimensions={setDimensions} currentSquares={currentSquares}
            setCurrentSquares={setCurrentSquares} labels={labels} setLabels={setLabels}
            sizeChangerSelected={sizeChangerSelected} setSizeChangerSelected={setSizeChangerSelected}
            clues={clues}/>
      <Grid height={dimensions[0]} width={dimensions[1]} currentSquares={currentSquares}
            setCurrentSquares={setCurrentSquares} labels={labels} setLabels={setLabels} 
            sizeChangerSelected={sizeChangerSelected} clues={clues} setClues={setClues}/>
    </div>
  )
}