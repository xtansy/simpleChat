import React from 'react';
import socket from '../socket';
import { useState, useRef, useEffect } from 'react';

const Chat = ({users,
    username,
    roomId,
    messages,
    onAddMessage}) => {

    const [message, setMessage] = useState('');

    const messageList = useRef();
        
    const onMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('ROOM:MESSAGE', {roomId, username, message});
            setMessage('');
            onAddMessage({username, message});
        }
    }

    useEffect(() => {
        messageList.current.scrollTo(0, 9999);
    }, [messages])

    return (
        <div className='container' >
            <h1>Skiddy Chat</h1>
            <h2>Номер комнаты: {roomId}</h2>
            <div className='chatbox'>

                <div className='chatbox__user-list'>
                    <h1>Online: {users.length && users.length}</h1>
                    <h1>User list</h1>
                    {
                        users && users.map((item, i) => {
                            return (
                                <div key={i} className='chatbox__user--active'>
                                    <p>{item}</p>
                                </div>
                            )
                        })
                    }

                </div>

                <div ref={messageList} className="chatbox__messages">
                    {
                        messages.map((item, i) => {
                            return (
                                <div key={i} className="chatbox__messages__user-message">
                                    <div className="chatbox__messages__user-message--ind-message ">
                                        <p className="name">{item.username}</p>
                                        <br/>
                                        <p className="message">{item.message}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <form>
                    <button className='send' onClick={onMessage}> отправить</button>
                    <input value={message} onChange={(e) => setMessage(e.target.value)}  type="text" placeholder='Введите сообщение...'></input>
                </form>
                
            </div>
        </div>
    );
};

export default Chat;