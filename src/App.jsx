import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import './App.css';
import musicImage from './assets/music.png';
import AudioSettings from './AudioSettings';


function App() {
  //playback and time related state
  const [isPlaying, setIsPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  //track the update timer
  const intervalRef = useRef(null);

  //audio effect 
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [reverbLevel,setReverbLevel] = useState(0.3)
  const [eq,setEq] = useState({bass:0, mid:0,treble:0});

  //References to Tone.js(Package) components
  const playerRef = useRef(null);
  const pitchShift = useRef(null);
  const reverb = useRef(null);
  const eq3 = useRef(null);

  //loading and initializing audio
  useEffect(() => {
    //load mp3 file
    const player = new Tone.Player({
      url: '/demo.mp3',
      autostart: false,
      loop: false,
      onload: () => {
        setDuration(player.buffer.duration);
        setLoaded(true);
      }
    });
    
    //initializing audio effects
    pitchShift.current = new Tone.PitchShift(pitch);
    reverb.current = new Tone.Reverb({decay:3,wet:reverbLevel});
    eq3.current = new Tone.EQ3(eq.bass,eq.mid,eq.treble);
    
    //connect the player to effects chain (output)
    player.chain(pitchShift.current, eq3.current, reverb.current, Tone.Destination);

    //store player instance
    playerRef.current = player;
    
    //cleanup on unmount
    return () => {
      player.dispose();
      pitchShift.current.dispose();
      reverb.current.dispose();
      eq3.current.dispose();
      clearInterval(intervalRef.current);
    };
  }, []);


  //updating currentTime while playing
  const UpdatingTime = (seek = 0,currentSpeed=1)=>{
    clearInterval(intervalRef.current);
    const startedAt = Tone.now();
    intervalRef.current =  setInterval(()=>{
      const elapsedTime = (Tone.now() - startedAt)*currentSpeed;
      const time = seek+elapsedTime;
      if(time>=duration){
        clearInterval(intervalRef.current);
        setIsPlaying(false);
        setCurrentTime(duration);
      }else{
        setCurrentTime(time);
      }
    },100)
  }

  //handling play/pause toggle
  const togglePlay = async () => {
    if (!loaded) return;

    //ensuring AudioContext is running
    if (Tone.getContext.state !== 'running') {
      await Tone.start();
    }

    if (!isPlaying) {
      //start playback at currentTime
      playerRef.current.playbackRate = speed;
      playerRef.current.start(0,currentTime);
      UpdatingTime(currentTime,speed);
    } else {
      //stop playback and clear timer
      playerRef.current.stop();
      clearInterval(intervalRef.current)
    }

    setIsPlaying(!isPlaying);
  };


  //seek to a specific time on track
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);

    if (isPlaying) { 
      playerRef.current.stop();
      playerRef.current.start(0,seekTime)
      UpdatingTime(seekTime,speed)
    }
  };
  // Restart interval with new speed
  useEffect(() => {
    if (isPlaying) {
      UpdatingTime(currentTime, speed); 
    }
  }, [speed]);

  //format seconds into mm:ss
  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const secLeft = Math.floor(sec % 60);
    return `${min}:${secLeft < 10 ? '0' : ''}${secLeft}`;
  };

  //---Audio Setting ---

  //speed Adjustment
  const updateSpeed = (val) =>{
    setSpeed(val);
    if(playerRef.current) playerRef.current.playbackRate = val;
  }

  //pitch adjustment
  const updatePitch = (val) => {
    setPitch(val);
    if (pitchShift.current) pitchShift.current.pitch = val;
  }
  
  //reverb adjustment
  const updateReverb = (val) =>{
    setReverbLevel(val);
    if (reverb.current) reverb.current.wet.value=val;
  };

  //equalizer adjustment
  const updateEq = (band,val) =>{
    const updated = { ...eq, [band]:val};
    setEq(updated);
    if(eq3.current){
      eq3.current.low.value = updated.bass;
      eq3.current.mid.value = updated.mid;
      eq3.current.high.value = updated.treble;
    }
  };

  return (
    <div className="container">
      <h1 className="header">Music App</h1>
      <div className="card">
        <img className="img" src={musicImage} width="250" height= "250" alt="Music" />
        <h2 className='header'>Demo Music</h2>

        <div className="controls">
          {/* pause/play button */}
          <button onClick={togglePlay} className="play-button">
            {isPlaying ? '⏸' : '▶'}
          </button>
          {/* audio track */}
          <div className="track">
            <span className="header">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              step="0.1"
              className="track-slider"
            />
            <span className="header">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      {/* Audio Setting */}
      <div className='cards'>
        <AudioSettings 
        speed={speed}
        pitch={pitch}
        reverbLevel={reverbLevel}
        eq={eq}
        onSpeedChange={updateSpeed}
        onPitchChange={updatePitch}
        onReverbChange={updateReverb}
        onEqChange={updateEq}
        />
      </div>
    </div>
  );
}

export default App;
