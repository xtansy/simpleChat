import React, { useState, useRef } from 'react';
import axios from 'axios';

const SignUp = ({ onLogin }) => {
	
	const validateRef = useRef();

	const [roomId, setRoomId] = useState('');
	const [username, setUsername] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const onEnter = async (e) => {
		e.preventDefault();
		if (roomId && username) {
			setIsLoading(true);
	
			const obj = {roomId, username};
	
			await axios.post('/room', obj)
	
			onLogin(obj);
		}
	}

	const isValidate = (value) => {
		if (value.length > 10) {
			validateRef.current.classList.add('app_non-validate');
			setRoomId('');
			setUsername('');
			return false;
		}
		validateRef.current.classList.remove('app_non-validate');
		return true;
	}

	const onChangeRoomId = (e) => {
		isValidate(e.target.value) && setRoomId(e.target.value);
	}

	const onChangeUserName = (e) => {
		isValidate(e.target.value) && setUsername(e.target.value);
	}

	return (
		<form className='SignUp'>
			<h1  ref={validateRef} className="app">LOGIN</h1>
			<input  value={roomId} type='number' className='SignUp__username' onChange={onChangeRoomId}placeholder="Enter the room ID"></input>
			<input  value={username} type='text' className='SignUp__password' onChange={onChangeUserName}placeholder="Enter the username"></input>
            <button disabled={isLoading} onClick={onEnter} className='SignUp__button'>{!isLoading ? 'Sign In' : 'Loading...'}</button>
		</form>
	);
};

export default SignUp;
