import React, { createContext, useState, useRef, useEffect } from 'react';

import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:8000');

const ContextProvider = ({ children }) => {
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then(currentStream => {
				setStream(currentStream);
				myVideo.current.srcObject = currentStream;
			});

		socket.on('me', id => setMe(id));

		socket.on('callUser', ({ from, name: callerName, signal }) => {
			setCall({ isReceivedCall: true, from, name: callerName });
		});
	}, []);

	const [stream, setStream] = useState(null);
	const [me, setMe] = useState('');
	const [name, setName] = useState('');
	const [call, setCall] = useState({});
	const [callAccepeted, setCallAccepeted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);

	const myVideo = useRef();
	const userVideo = useRef();
	const connectionRef = useRef();

	const answerCall = () => {
		setCallAccepeted(true);

		const peer = new Peer({
			initiator: false,
			trickles: false,
			stream,
		});

		peer.on('signal', data => {
			socket.emit('answerCall', { signal: data, to: call.from });
		});

		peer.on('stream', currentStream => {
			userVideo.current.srcObject = currentStream;
		});

		peer.signal(call.signal);

		connectionRef.current = peer;
	};

	const callUser = id => {
		const peer = new Peer({
			initiator: true,
			trickles: false,
			stream,
		});

		peer.on('signal', data => {
			socket.emit('callUser', {
				userToCall: id,
				signalData: data,
				from: me,
				name,
			});
		});

		peer.on('stream', currentStream => {
			userVideo.current.srcObject = currentStream;
		});

		socket.on('callaccepted', signal => {
			setCallAccepeted(true);

			peer.signal = signal;

			connectionRef.current = peer;
		});
	};
	const leaveCall = () => {
		setCallEnded(true);

		connectionRef.current.destroy();

		window.location.reload();
	};

	return (
		<SocketContext.Provider
			value={{
				call,
				callAccepeted,
				myVideo,
				userVideo,
				stream,
				name,
				setName,
				callEnded,
				me,
				callUser,
				leaveCall,
				answerCall,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export { ContextProvider, SocketContext };
