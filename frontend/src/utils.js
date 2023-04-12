/*
Generic utils.
*/

export function isAlphanumeric(str) {
  return str.match(/^[a-zA-Z0-9]+$/) !== null;
}

export function getNextLabels(nextSquares, height, width) {
  let nextLabels = Array(height * width).fill(null)
  let counter = 1;
  for (let i = 0; i < nextSquares.length; i++) {
    if (nextSquares[i] !== "." && ((i < width || nextSquares[i - width] === ".") 
                                   || (i % width === 0 || nextSquares[i - 1] === "."))) {
      nextLabels[i] = [counter, (i < width || nextSquares[i - width] === "."), 
                       (i % width === 0 || nextSquares[i - 1] === ".")];
      counter++;
    }
  }
  return nextLabels;
}

export function getNextClues(labels, clues) {
  const [acrossClues, downClues] = [clues["a"], clues["d"]];
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    if (label[0] !== null) {
      if (label[1]) {
        let newClue = "[no clue]";
        if (acrossClues.has(label)) {
          newClue = acrossClues.get(label);
        }
        acrossClues.set(label, newClue);
      }
      if (labels[i][2]) {
        let newClue = "[no clue]";
        if (downClues.has(label)) {
          newClue = downClues.get(label);
        }
        downClues.set(label, newClue);
      }
    } else {
        if (acrossClues.has(label)) {
          acrossClues.delete(label);
        }
        if (downClues.has(label)) {
          downClues.delete(label);
        }
    }
  };
  return { "a": acrossClues, "d": downClues };
}