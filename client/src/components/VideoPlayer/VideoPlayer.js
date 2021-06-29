import React, { useContext } from 'react';
import { Grid, Typography, Paper } from '@material-ui/core';
import { SocketContext } from '../../SocketContext';

import useStyles from './styles';

const VideoPlayer = () => {
	const { name, callAccepeted, myVideo, userVideo, callEnded, stream, call } =
		useContext(SocketContext);
	const classes = useStyles();

	return (
		<Grid container className={classes.gridContainer}>
			{/* Our Video */}
			{stream && (
				<Paper className={classes.paper}>
					<Grid item xs={12} md={6}>
						<Typography variant="h5" gutterBottom>
							{name || 'Name'}
						</Typography>
						<video
							playsInline
							muted
							ref={myVideo}
							autoPlay
							className={classes.video}
						/>
					</Grid>
				</Paper>
			)}

			{/* User Video */}
			{callAccepeted && !callEnded && (
				<Paper className={classes.paper}>
					<Grid item xs={12} md={6}>
						<Typography variant="h5" gutterBottom>
							{call.name || 'Name'}
						</Typography>
						<video
							playsInline
							ref={userVideo}
							autoplay
							className={classes.video}
						/>
					</Grid>
				</Paper>
			)}
		</Grid>
	);
};

export default VideoPlayer;
