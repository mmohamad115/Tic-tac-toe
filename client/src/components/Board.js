import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../Patterns";

function Board({ result, setResult }) {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState("X");
    const [turn, setTurn] = useState("X");

    const { channel } = useChannelStateContext();
    const { client } = useChatContext();

    useEffect(() => {
        checkIfTie();
        checkWin();
    }, [board])
    const chooseSquare = async (square) => {
        console.log("Before move - Board:", board);
        console.log("Before move - Turn:", turn);
        console.log("Before move - Player:", player);

        if (turn === player && board[square] === "") {
            setBoard((prevBoard) =>
                prevBoard.map((val, idx) => (idx === square ? player : val))
            );
            setTurn(player === "X" ? "O" : "X");
            await channel.sendEvent({
                type: "game-move",
                data: { square, player: player },
            });

            console.log("After move - Board:", board);
            console.log("After move - Turn:", turn);
        }
    };

    const checkWin = () => {
        Patterns.forEach((currentPattern) => {
            const firstPlayer = board[currentPattern[0]];
            if (firstPlayer === "") return;
            let foundWinningPattern = true;
            currentPattern.forEach((idx) => {
                if (board[idx] !== firstPlayer) {
                    foundWinningPattern = false;
                }
            });

            if (foundWinningPattern) {
                alert("Winner", board[currentPattern[0]])
                setResult({ winner: board[currentPattern[0]], state: "won" });
            }
        });
    };

    const checkIfTie = () => {
        let filled = true
        board.forEach((square) => {
            if (square === "") {
                filled = false
            }
        });

        if (filled) {
            alert("Game Tied")
            setResult({ winner: "none", state: "tie" });
        }
    }

    channel.on((event) => {
        if (event.type === "game-move" && event.user.id !== client.userID) {
            const currentPlayer = event.data.player === "X" ? "O" : "X";
            console.log("Event received - Board:", board);
            console.log("Event received - Turn:", turn);
            setPlayer(currentPlayer);
            setTurn(currentPlayer);
            setBoard(
                board.map((val, idx) => {
                    if (idx === event.data.square && val === "") {
                        return event.data.player;
                    }
                    return val;
                })
            );
        }
    });

    return (
        <div className="board">
            <div className="row">
                <Square
                    val={board[0]}
                    chooseSquare={() => {
                        chooseSquare(0);
                    }}
                />
                <Square
                    val={board[1]}
                    chooseSquare={() => {
                        chooseSquare(1);
                    }}
                />
                <Square
                    val={board[2]}
                    chooseSquare={() => {
                        chooseSquare(2);
                    }}
                />
            </div>
            <div className="row">
                <Square
                    val={board[3]}
                    chooseSquare={() => {
                        chooseSquare(3);
                    }}
                />
                <Square
                    val={board[4]}
                    chooseSquare={() => {
                        chooseSquare(4);
                    }}
                />
                <Square
                    val={board[5]}
                    chooseSquare={() => {
                        chooseSquare(5);
                    }}
                />
            </div>
            <div className="row">
                <Square
                    val={board[6]}
                    chooseSquare={() => {
                        chooseSquare(6);
                    }}
                />
                <Square
                    val={board[7]}
                    chooseSquare={() => {
                        chooseSquare(7);
                    }}
                />
                <Square
                    val={board[8]}
                    chooseSquare={() => {
                        chooseSquare(8);
                    }}
                />
            </div>
        </div>
    );
}

export default Board