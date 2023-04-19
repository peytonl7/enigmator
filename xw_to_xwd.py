
import sys
import json
from pprint import pprint

def get_clues(file):
    clues = file["clues"]
    new_clues = { "across": {}, "down": {} }
    for key in clues:
        for clue in clues[key]:
            dot = clue.find(".")
            new_clues[key][int(clue[:dot])] = clue[dot+2:]
    return new_clues

def get_grid(file):
    grid = file["grid"]
    new_grid = []
    for i in range(file["size"]["rows"]):
        new_grid.append(grid[i * file["size"]["cols"]:(i + 1) * file["size"]["cols"]])
    return new_grid

def get_across(size, clues, grid):
    across = {}
    clue_counter = 0
    curr_word, clue_no, word_start = "", None, [None, None]
    clue_nos = [[None for _ in range(size["cols"])] for _ in range(size["rows"])]
    for row in range(size["rows"]):
        for col in range(size["cols"]):
            if grid[row][col] != "." and (not row or not col or grid[row - 1][col] == "." or grid[row][col - 1] == "."):
                clue_counter += 1
                clue_nos[row][col] = clue_counter
            if curr_word and (grid[row][col] == "." or (col == 0 and row != 0)):
                across[clue_no] = {"clue":clues["across"][clue_no], "answer":curr_word, "row":word_start[0], "col":word_start[1]}
                curr_word = ""
            if grid[row][col] != ".":
                word_start = word_start if curr_word else [row, col]
                clue_no = clue_no if curr_word else clue_counter
                curr_word += grid[row][col]
                if row == size["rows"] - 1 and col == size["cols"] - 1:
                    across[clue_no] = {"clue":clues["across"][clue_no], "answer":curr_word, "row":word_start[0], "col":word_start[1]}
    return across, clue_nos
    

def get_down(size, clues, grid, clue_nos):
    down = {}
    curr_word, word_start = "", [None, None]
    for col in range(size["cols"]):
        for row in range(size["rows"]):
            if curr_word and (grid[row][col] == "." or (row == 0 and col != 0)):
                clue_no = clue_nos[word_start[0]][word_start[1]]
                down[clue_no] = {"clue":clues["down"][clue_no], "answer":curr_word, "row":word_start[0], "col":word_start[1]}
                curr_word = ""
            if grid[row][col] != ".":
                word_start = word_start if curr_word else [row, col]
                curr_word += grid[row][col]
                if row == size["rows"] - 1 and col == size["cols"] - 1:
                    clue_no = clue_nos[word_start[0]][word_start[1]]
                    down[clue_no] = {"clue":clues["across"][clue_no], "answer":curr_word, "row":word_start[0], "col":word_start[1]}
    return down

def main():
    if len(sys.argv) < 2:
        print("Must pass filename")
    filename = sys.argv[1]
    assert(filename[-3:] == ".xw")
    file = json.load(open(filename))
    size, clues, grid = file["size"], get_clues(file), get_grid(file)
    across, clue_nos = get_across(size, clues, grid)
    pprint(grid)
    down = get_down(size, clues, grid, clue_nos)
    json_object = json.dumps({"across": across, "down": down}, indent=2)
    with open(filename + "d", "w") as outfile:
        outfile.write(json_object)
    print("Written to file: " + filename + "d")

if __name__ == "__main__":
    main()