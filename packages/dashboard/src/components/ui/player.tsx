import {
  FastForwardRounded,
  FastRewindRounded,
  PauseRounded,
  PlayArrowRounded,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  IconButton,
  Slider,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import React, {
  FunctionComponent,
  SyntheticEvent,
  useRef,
  useState,
} from 'react';
import {
  default as FilePlayer,
  default as ReactPlayer,
} from 'react-player/file';

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export const Player: PlayerComponent = (props) => {
  const { src } = props;

  const theme = useTheme();
  const playerRef = useRef<FilePlayer>();
  const [playing, setPlaying] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [seeking, setSeeking] = useState(false);

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = +(value - minute * 60).toFixed();
    return `${minute}:${secondLeft <= 9 ? `0${secondLeft}` : secondLeft}`;
  }

  function handleProgress(state: any) {
    if (!seeking) {
      setPlayed(state.played);
      setPlayedSeconds(state.playedSeconds);
    }
  }

  function handleDuration(duration: number) {
    if (!seeking) {
      setDuration(duration);
    }
  }

  const handleSeekChange = (
    e: Event | SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    setSeeking(true);
    setPlayed(value as number);
  };

  const handleChangeCommitted = (
    e: Event | SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    setSeeking(false);
    playerRef.current && playerRef.current.seekTo(value as number);
  };

  return (
    <Box
      width="100%"
      position="relative"
      p={2}
      borderRadius={2}
      border={`1px solid ${alpha(theme.palette.secondary.main, 0.2)}`}
    >
      {showCover && (
        <IconButton
          aria-label="play"
          onClick={() => {
            setShowCover(false);
            setPlaying(true);
          }}
          sx={{
            borderRadius: 0,
            position: 'absolute',
            width: 'calc(100% - 32px)',
            height: 'calc(100% - 158px)',
            left: 16,
            top: 16,
            zIndex: 1,
          }}
        >
          <PlayArrowRounded sx={{ fontSize: '200px' }} />
        </IconButton>
      )}
      <ReactPlayer
        url={src}
        playing={playing}
        progressInterval={100}
        ref={playerRef as any}
        muted
        width="100%"
        height="100%"
        onEnded={() => {
          setPlaying(false);
        }}
        onProgress={handleProgress}
        onDuration={handleDuration}
      />
      <Slider
        aria-label="time-indicator"
        size="small"
        value={played}
        min={0}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => formatDuration(value * duration)}
        step={0.01}
        max={1}
        onChangeCommitted={handleChangeCommitted}
        onChange={handleSeekChange}
        sx={{
          mt: 4,
          color: theme.palette.primary.main,
          height: 3,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: -2,
        }}
      >
        <TinyText>{formatDuration(playedSeconds)}</TinyText>
        <TinyText>{formatDuration(duration - playedSeconds)}</TinyText>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: -1,
        }}
      >
        <IconButton
          aria-label="fast rewind"
          onClick={() =>
            playerRef.current &&
            playerRef.current.seekTo(
              playedSeconds - 2 < 0 ? 0 : playedSeconds - 2
            )
          }
        >
          <FastRewindRounded fontSize="large" />
        </IconButton>
        <IconButton
          aria-label={playing ? 'play' : 'pause'}
          onClick={() => setPlaying(!playing)}
        >
          {playing ? (
            <PauseRounded sx={{ fontSize: '3rem' }} />
          ) : (
            <PlayArrowRounded sx={{ fontSize: '3rem' }} />
          )}
        </IconButton>
        <IconButton
          aria-label="fast forward"
          onClick={() => {
            playerRef.current &&
              playedSeconds + 2 < duration &&
              playerRef.current.seekTo(playedSeconds + 2);
          }}
        >
          <FastForwardRounded fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

type PlayerProps = {
  src?: string;
};
type PlayerComponent = FunctionComponent<PlayerProps>;
