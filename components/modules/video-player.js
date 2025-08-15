import React, { forwardRef, useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

import Icon from '~/components/modules/icon';

// MAKE SURE TO KEEP THIS
import trackEvent from '~/hooks/useEventTracker';

/*
Responsive video player using react-player
@url: https://github.com/CookPete/react-player

@url: Video file URL
@placeholder: Video poster image
@playerOptions: Use to pass in any extra options to react-player
@containerClasses: Pass extra classes to the container element
@aspectRatio: Set player aspect ratio (Default: 16x9)
*/

const isBrowser = typeof window !== 'undefined';

const VideoPlayer = forwardRef(
	(
		{
			url,
			title,
			imageAlt,
			placeholder,
			className,
			containerClassName,
			innerContainerClassName,
			aspectRatio = 'aspect-16/9',
			playOnLoad = false,
			playsInline,
			muted = false,
			autoPlay = true,
			onReady,
			...playerOptions
		},
		ref
	) => {
		const [lightMode, setLightMode] = useState(placeholder);
		const [isReady, setIsReady] = useState(false);
		const [isPlaying, setIsPlaying] = useState(autoPlay);
		const [seekTo, setSeekTo] = useState(null);
		const [pageLoaded, setPageLoaded] = useState(false);
		const playerRef = useRef(null);
		const divRef = useRef(null);
		const [lastPercentProgress, setLastPercentProgress] = useState(0);

		useEffect(() => {
			if (isBrowser) {
				setPageLoaded(true);
			}
		}, [autoPlay, setPageLoaded]);

		useEffect(() => {
			if (isReady && seekTo) {
				playerRef.current.seekTo(parseFloat(seekTo), 'seconds');
				setIsPlaying(true);
				if (isBrowser && divRef.current) {
					divRef.current.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}
				setSeekTo(null);
			}
		}, [isReady, seekTo]);

		return (
			<div ref={ref} className={`${containerClassName ?? ''}`}>
				<div
					ref={divRef}
					className={`
						block relative w-full overflow-hidden
						${innerContainerClassName ?? ''}
						${aspectRatio}
					`}
				>
					{pageLoaded && (
						<ReactPlayer
							ref={playerRef}
							className={`
								border-0 my-0
								${className ?? ''}
							`}
							src={url}
							light={
								playOnLoad
									? false
									: lightMode === false
										? lightMode
										: placeholder
							}
							onReady={() => {
								setIsReady(true);
								setIsPlaying(autoPlay);
								onReady && onReady();
							}}
							onStart={() => {
								trackEvent('Engagement', 'video_start', title);
							}}
							onPlay={() => {
								setIsPlaying(true);
							}}
							onPause={() => {
								setIsPlaying(false);
								trackEvent('Engagement', 'video_pause', title);
							}}
							progressInterval={500}
							onProgress={progress => {
								const duration = playerRef.current.duration;
								const percentPlayed = Math.floor(
									((progress.playedSeconds * 10) / duration) * 10
								);
								if (
									[10, 25, 50, 75].includes(percentPlayed) &&
									percentPlayed !== lastPercentProgress
								) {
									trackEvent(
										'Engagement',
										`video_progress`,
										title,
										percentPlayed
									);
									setLastPercentProgress(percentPlayed);
								}
								if (isBrowser) {
									document
										.querySelectorAll('button:focus')
										.forEach(el => el.blur());
								}
							}}
							onEnded={() => {
								trackEvent('Engagement', 'video_complete', title);
							}}
							playing={isPlaying}
							autoPlay={autoPlay}
							playsInline={playsInline}
							width="100%"
							height="100%"
							muted={muted}
							playIcon={
								<button className="bg-blue-400 bg-opacity-70 p-1 rounded-full transition-colors hover:bg-opacity-90 focus:bg-opacity-90">
									<span className="sr-only">Play</span>
									<Icon
										icon="fe:play"
										size="size-12"
										className="text-white drop-shadow-md translate-x-1"
									/>
								</button>
							}
							{...playerOptions}
						/>
					)}
				</div>
			</div>
		);
	}
);

export default VideoPlayer;
