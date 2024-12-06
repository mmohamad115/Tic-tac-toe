import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

function JoinGame() {
    const [rivalUsername, SetRivalUsername] = useState("");
    const { client } = useChatContext();
    const [channel, setChannel] = useState(null);
    const craeteChannel = async () => {
        const response = await client.queryUsers({ name: { $eq: rivalUsername } });

        if (response.users.length === 0) {
            alert("User not found")
            return
        }

        const newChannel = await client.channel("messaging", {
            members: [client.userID, response.users[0].id],
        });

        await newChannel.watch();
        setChannel(newChannel);
    }
    return (
        <>
            {channel ? (
                <Channel channel={channel} Input={CustomInput}>
                    <Game channel={channel} setChannel={setChannel} />
                </Channel>
            ) : (
                <div className="joinGame">
                    <h4>Create Game</h4>
                    <input placeholder="Username of rival..." onChange={(event) => { SetRivalUsername(event.target.value) }} />
                    <button onClick={craeteChannel}>Join/Start Game</button>
                </div>
            )}
        </>
    );
}

export default JoinGame