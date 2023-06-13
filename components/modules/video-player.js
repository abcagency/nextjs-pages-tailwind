import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';

import Icon from '~/components/icon';

/*
Responsive video player using react-player
@url: https://github.com/CookPete/react-player

@url: Video file URL
@placeholder: Video poster image
@playerOptions: Use to pass in any extra options to react-player
*/

const isBrowser = typeof window !== 'undefined';

const VideoPlayer = ({
	url,
	placeholder,
	aspectRatio = "16x9",
	playerClasses,
	className,
	muted = false,
	autoPlay = true,
	...playerOptions
}) => {
	const [isReady, setIsReady] = useState(false);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [, setPlayed] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const playerRef = useRef(null);

	useEffect(() => {
		if (isBrowser) {
			setPageLoaded(true);
		}
	}, [autoPlay, setPageLoaded]);

	return (
		<div
			className={`
				block relative w-full overflow-hidden
				${className ?? ''}
			`}
		>
			<div className={`
				absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
			`}>
				<Icon
					icon="mdi:loading"
					className="animate-spin text-white"
					sizeClasses="w-16 h-16"
				/>
			</div>
			{/*
				Inline switch to set player aspect ratio
				@default: 16x9
				@usage: aspectRatio="21x9"
			*/}
			{
				{
					'21x9': <span className="block pt-[42.86%]" aria-hidden="true"></span>,
					'16x9': <span className="block pt-[56.25%]" aria-hidden="true"></span>,
					'9x16': <span className="block pt-[177.78%]" aria-hidden="true"></span>,
					'4x3': <span className="block pt-[75%]" aria-hidden="true"></span>,
					'1x1': <span className="block pt-[100%]" aria-hidden="true"></span>
				}[aspectRatio]
				|| <span className="block pt-[56.25%]" aria-hidden="true"></span>
			}
			{pageLoaded &&
				<ReactPlayer
					ref={playerRef}
					className={`
						absolute inset-0 w-full h-full border-0 my-0
						${isReady ? 'hidden' : 'block'}
						${playerClasses ?? ''}
					`}
					url={url}
					progressInterval={3000}
					// eslint-disable-next-line no-unused-vars
					onProgress={played => {
						setPlayed(played);
					}}
					light={placeholder}
					onReady={() => { setIsReady(true); setIsPlaying(autoPlay);}}
					onPlay={() => setIsPlaying(true)}
					onPause={() => setIsPlaying(false)}
					playing={isPlaying}
					autoPlay={autoPlay}
					width="100%"
					height="auto"
					muted={muted}
					{...playerOptions}
				/>
			}
		</div>
	);
};

export default VideoPlayer;
