import React, { useState } from 'react';
import axios from 'axios';

const SignUp = ({ onLogin }) => {
	

	const [roomId, setRoomId] = useState(null);
	const [username, setUsername] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const onEnter = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const obj = {roomId, username};

		await axios.post('/room', obj)


		onLogin(obj);
	}

	return (
		<form className='SignUp'>
			<h1 className="app">LOGIN</h1>
			<input className='SignUp__username' onChange={(e) => setRoomId(e.target.value)}placeholder="Enter the room ID"></input>
			<input className='SignUp__password' onChange={(e) => setUsername(e.target.value)}placeholder="Enter the username"></input>
            <button disabled={isLoading} onClick={onEnter} className='SignUp__button'>{!isLoading ? 'Sign In' : 'Loading...'}</button>
		</form>
	);
};

export default SignUp;
