import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

// TODO -------------------------------------------

// make start screen, game over screen, display score, and replay

const Gameboard = ({
  board,
  setBoard,
  currentSnake,
  setCurrentSnake,
  unoccupiedTiles,
  grid,
  squareSize,
  gridContainerSize,
  directionProperties,
  refreshRate,
}) => {
  // DECLARATIONS ---------------------------------

  const rows = grid;
  const columns = grid;
  const [fruitLocation, setFruitLocation] = useState({
    xAxis: grid / 2,
    yAxis: grid / 2 - 3,
  });
  const currentSnakeCopy = currentSnake;
  const currentSnakeHead = currentSnakeCopy[0];
  const countRef = useRef(null);
  const [savedInput, setSavedInput] = useState("");
  const [changingState, setChangingState] = useState();

  // GENERATE BOARD ------------------------------

  // generate board
  // on mount run a loop of loops to get the board and coordinates
  useEffect(() => {
    const boardSquares = [];
    const generateBoard = () => {
      for (let i = 0; i < columns; i++) {
        const yNum = i + 1;

        for (let j = 0; j < rows; j++) {
          const xNum = j + 1;

          const square = {};

          square["yAxis"] = yNum;
          square["xAxis"] = xNum;

          boardSquares.push(square);
        }
      }

      setBoard(boardSquares);
    };
    generateBoard();
    console.log("generatingBoard");
  }, []);

  // FRUIT  ------------------------------------

  const spawnFruit = (availableSquares) => {
    if (availableSquares) {
      const randomLocation = getRandomSquare(availableSquares);
      setFruitLocation(randomLocation);
    }
  };

  const getRandomSquare = (availableSquares) => {
    const min = Math.floor(0);
    const max = Math.ceil(availableSquares.length - 1);
    const randomIdx = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomSquare = availableSquares[randomIdx];
    return randomSquare;
  };

  const eatFruit = () => {
    const bodyPart = {};

    bodyPart["x"] = currentSnakeCopy[currentSnakeCopy.length - 1].lastX;
    bodyPart["y"] = currentSnakeCopy[currentSnakeCopy.length - 1].lastY;
    bodyPart["lastX"] = 0;
    bodyPart["lastY"] = 0;

    currentSnakeCopy.push(bodyPart);

    setCurrentSnake(currentSnakeCopy);
  };

  // CONTROLS -------------------------------------

  // updating snake body part positions
  // first modifies the heads last x/y after it moves, then modifies the body parts
  const updatingSnake = (key, value) => {
    let arr = currentSnakeCopy.slice();

    let temporaryArr = [];

    if (arr[0]) {
      const currentX = currentSnakeCopy[0].x;
      const currentY = currentSnakeCopy[0].y;

      arr[0]["lastX"] = currentX;
      arr[0]["lastY"] = currentY;
      arr[0][key] = value;

      temporaryArr = arr;

      for (let i = 0; i < currentSnakeCopy.length; i++) {
        const currentX = currentSnakeCopy[i].x;
        const currentY = currentSnakeCopy[i].y;

        if (i > 0) {
          const prevPartLastX = currentSnakeCopy[i - 1].lastX;
          const prevPartLastY = currentSnakeCopy[i - 1].lastY;

          arr[i]["lastX"] = currentX;
          arr[i]["lastY"] = currentY;
          arr[i]["x"] = prevPartLastX;
          arr[i]["y"] = prevPartLastY;

          temporaryArr = arr;
        }
      }

      return temporaryArr;
    }
  };

  // button input listeners
  // on button press, modify the x or y of snake head, and then update body

  let tempSnake = [];

  useEffect(() => {
    const changeDirectionHandler = (event) => {
      const buttonPressed = event.key;
      const input = directionProperties[buttonPressed];

      if (input) {
        if (currentSnake.length === 1) {
          setSavedInput(input.direction);
        } else {
          if (savedInput !== input.oppDirection) {
            setSavedInput(input.direction);
          }
        }
      }
    };

    //=================================================

    const dir = directionProperties[savedInput];

    if (dir) {
      clearInterval(countRef.current);
      countRef.current = setInterval(() => {
        setChangingState(new Date());
        //=================================================

        if (
          fruitLocation.xAxis === currentSnakeHead.x &&
          fruitLocation.yAxis === currentSnakeHead.y
        ) {
          spawnFruit(unoccupiedTiles.current);
          eatFruit();
        }

        if (currentSnakeHead[dir.axis] === dir.warpPoint) {
          tempSnake = updatingSnake(dir.axis, dir.warpDestination);
        } else {
          tempSnake = updatingSnake(
            dir.axis,
            currentSnakeHead[dir.axis] + dir.movement
          );
        }

        setCurrentSnake(tempSnake);

        //=================================================
      }, refreshRate);
    }

    window.addEventListener("keydown", changeDirectionHandler);

    return () => {
      clearInterval(countRef.current);
      window.removeEventListener("keydown", changeDirectionHandler);
    };
  }, [currentSnake, savedInput]);

  // RENDER -------------------------------------

  const isSquareOccupied = (square, squareIdx) => {
    if (squareIdx === 0) {
      unoccupiedTiles.current = [];
    }
    const squareX = square.xAxis;
    const squareY = square.yAxis;

    let notOccupied = false;

    for (let i = 0; i < currentSnakeCopy.length; i++) {
      if (
        currentSnakeCopy[i].x === squareX &&
        currentSnakeCopy[i].y === squareY
      ) {
        return true;
      } else {
        notOccupied = true;
      }
    }
    if (notOccupied) {
      unoccupiedTiles.current.push(square);
    }
  };

  return (
    <div>
      {/* container made to constrain grid to shape */}
      <div
        style={{
          background: "#9cd1b6",
          padding: "2px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          width: `${gridContainerSize}px`,
          height: `${gridContainerSize}px`,
        }}
      >
        {/* map over board array and create squares */}
        {board.map((square, squareIdx) => {
          return (
            <div key={uuidv4()}>
              {/* check to see if each square matches any of the snake parts */}
              {isSquareOccupied(square, squareIdx) ? (
                <div
                  style={{
                    background: "#364A42",
                    height: `${squareSize}px`,
                    width: `${squareSize}px`,
                    margin: "1px",
                  }}
                ></div>
              ) : (
                <>
                  {/* the fruit location is not being updated by the time the board is rendered */}
                  {/* if not occupied and is a location of a fruit, make square red */}
                  {fruitLocation &&
                  square.xAxis === fruitLocation.xAxis &&
                  square.yAxis === fruitLocation.yAxis ? (
                    <div
                      style={{
                        background: "#6b9383",
                        height: `${squareSize}px`,
                        width: `${squareSize}px`,
                        margin: "1px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        background: "#9cd1b6",
                        height: `${squareSize}px`,
                        width: `${squareSize}px`,
                        margin: "1px",
                      }}
                    ></div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gameboard;
