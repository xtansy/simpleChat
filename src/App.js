import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "./socket";

import { SignUp, Chat } from "./components";

const App = () => {
    const dispatch = useDispatch();

    const { users, username, roomId, messages, joined } = useSelector(
        (state) => state
    );

    const setUsers = (users) => {
        dispatch({ type: "SET_USERS", payload: users });
    };

    const onAddMessage = ({ username, message }) => {
        dispatch({ type: "NEW_MESSAGE", payload: { username, message } });
    };

    const onLogin = async ({ roomId, username }) => {
        dispatch({ type: "ROOMS:JOINED", payload: { username, roomId } });
        socket.emit("ROOM:JOIN", { roomId, username });
    };

    useEffect(() => {
        socket.on("ROOM:SET_USERS", (users) => {
            setUsers(users);
        });

        socket.on("ROOM:SET_DATA", (obj) => {
            dispatch({ type: "SET_DATA", payload: obj });
        });

        socket.on("ROOM:MESSAGE", (messages) => {
            onAddMessage(messages);
        });
    }, []);

    return (
        <>
            {!joined ? (
                <SignUp onLogin={onLogin} />
            ) : (
                <Chat
                    username={username}
                    users={users}
                    roomId={roomId}
                    messages={messages}
                    onAddMessage={onAddMessage}
                />
            )}
        </>
    );
};

export default App;
