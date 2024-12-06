import React, { useState } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import "./Chat.css";


function Game({ channel, setChannel }) {
    const [playersJoined, setPlayersJoined] = useState(channel.state.watcher_count === 2);
    const [result, setResult] = useState({ winner: "none", state: "none" });

    channel.on("user.watching.start", (event) => {
        setPlayersJoined(event.watcher_count === 2)
    });
    if (!playersJoined) {
        return <div>Waiting for the other player to join...</div>
    }
    return (
        <div className="gameContainer">
            <Board result={result} setResult={setResult} />
            <Window>
                <MessageList
                    hideDeletedMessages
                    messageActions={["react"]}
                    defaultItemHeight={100}
                    disableDateSeparator
                    closeReactionSelectorOnClick
                />
                <MessageInput noFiles />
            </Window>
            <button className="leaveGame" onClick={async () => {
                await channel.stopWatching();
                setChannel(null)
            }}>Leave Game</button>
            {result.state === "won" && <div>{result.winner} Won the game</div>}
            {result.state === "tie" && <div>Game Tied</div>}
        </div>
    );
}

export default Game