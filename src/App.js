import React from 'react';
import socket from './socket';
import { SignUp, Chat } from './components';
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';

import { useEffect } from 'react';



const App = () => {

	const dispatch = useDispatch();

	const joined = useSelector(state => state.joined)

    const { users, username, roomId, messages} = useSelector(state => state)


	const onLogin = async ( {roomId, username} ) => { 

		dispatch({type: 'ROOMS:JOINED', payload: {username, roomId}})

		socket.emit('ROOM:JOIN', {roomId, username})

		const response = await axios.get(`/room:${roomId}`);

		const obj = response.data;


		dispatch({type:'SET_DATA', payload: obj})
	}

	const setUsers = (users) => {
		dispatch({type: 'SET_USERS', payload: users})
	}

	const onAddMessage = (messages) => {
		dispatch({type: 'NEW_MESSAGE', payload: messages});
	}

	useEffect(() => {
		socket.on('ROOM:SET_USERS', (users) => {
			setUsers(users);
		})

		socket.on('ROOM:MESSAGE', (messages) => {
			onAddMessage(messages);
		})

	}, [])

	return (
		<>
			{!joined ? <SignUp onLogin={onLogin}/> : <Chat 
			users={users} 
			username={username} 
			roomId={roomId} 
			messages={messages}
			onAddMessage={onAddMessage}
			/>}
		</>
	);
};

export default App;