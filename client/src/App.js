import React from 'react';
import { Typography, AppBar } from '@material-ui/core';

import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import Notifications from './components/Notifications/Notifications';
import Options from './components/Options/Options';

import useStyles from './styles';

function App() {
	const classes = useStyles();
	return (
		<div className={classes.wrapper}>
			<AppBar className={classes.appBar} position="static" color="inherit">
				<Typography variant="h2" align="center">
					Video Chat
				</Typography>
			</AppBar>
			{/* Video Player */}
			<VideoPlayer />
			<Options>
				{/* Notification Component */}
				<Notifications />
			</Options>
		</div>
	);
}

export default App;
