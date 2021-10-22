import React, { useState, useRef, useEffect } from "react";
import Gameboard from "./Gameboard";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";

function App() {
  const font1 = createMuiTheme({
    typography: {
      fontFamily: ["Share Tech Mono", "monospace"].join(","),
    },
  });

  const squareSize = 20;
  const grid = 14; //keep this number even
  const refreshRate = 70; //ms
  const gridContainerSize = grid * squareSize + 2 * grid;
  const [gameState, setGameState] = useState("play");
  const unoccupiedTiles = useRef([]);
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [currentSnake, setCurrentSnake] = useState([
    { x: grid / 2, y: grid / 2, lastX: grid / 2 + 1, lastY: grid / 2 },
  ]);

  const directionProperties = {
    w: {
      direction: "w",
      oppDirection: "s",
      axis: "y",
      warpPoint: 1,
      warpDestination: grid,
      movement: -1,
    },

    s: {
      direction: "s",
      oppDirection: "w",
      axis: "y",
      warpPoint: grid,
      warpDestination: 1,
      movement: 1,
    },

    d: {
      direction: "d",
      oppDirection: "a",
      axis: "x",
      warpPoint: grid,
      warpDestination: 1,
      movement: 1,
    },

    a: {
      direction: "a",
      oppDirection: "d",
      axis: "x",
      warpPoint: 1,
      warpDestination: grid,
      movement: -1,
    },
  };

  useEffect(() => {
    if (
      unoccupiedTiles.current.length > board.length - currentSnake.length &&
      board.length - currentSnake.length >= 0
    ) {
      setScore(currentSnake.length - 1);
      setCurrentSnake([
        { x: grid / 2, y: grid / 2, lastX: grid / 2 + 1, lastY: grid / 2 },
      ]);

      setGameState("gameover");
    }
  }, [currentSnake]);

  return (
    <div
      style={{
        background: "#BEE2D0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemeProvider theme={font1}>
        <Typography style={{ fontSize: "30px", color: "#364A42" }}>
          {" "}
          SNAKE
        </Typography>
        <Typography
          style={{ fontSize: "15px", color: "#364A42", marginBottom: "30px" }}
        >
          By: Daemon-ic
        </Typography>

        {gameState === "play" && (
          <>
            <Gameboard
              grid={grid}
              squareSize={squareSize}
              gridContainerSize={gridContainerSize}
              board={board}
              setBoard={setBoard}
              currentSnake={currentSnake}
              setCurrentSnake={setCurrentSnake}
              unoccupiedTiles={unoccupiedTiles}
              directionProperties={directionProperties}
              refreshRate={refreshRate}
            />
          </>
        )}

        {gameState === "gameover" && (
          <>
            <div
              style={{
                background: "#9cd1b6",
                padding: "2px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: `${gridContainerSize}px`,
                height: `${gridContainerSize}px`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20%",
                  marginBottom: "20%",
                }}
              >
                <Typography style={{ fontSize: "40px", color: "#364A42" }}>
                  GAME OVER
                </Typography>
                <Typography style={{ color: "#364A42" }}>
                  SCORE: {score}
                </Typography>
              </div>
              <Button
                style={{ color: "#364A42" }}
                onClick={() => setGameState("play")}
              >
                replay
              </Button>
            </div>
          </>
        )}
        <Typography
          style={{
            fontSize: "10px",
            color: "#6b9383",
            marginTop: "10px",
            marginBottom: "30px",
          }}
        >
          W,A,S,D to move // made with react js
        </Typography>
      </ThemeProvider>
    </div>
  );
}

export default App;
