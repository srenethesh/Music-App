import React from "react";
import "./App.css";
const AudioSettings = ({speed,pitch, reverbLevel,eq, onSpeedChange, onPitchChange, onReverbChange, onEqChange}) =>{
    return(
        <div className="adjustments">
            <h3 className="header">Audio Settings</h3>
            <div className="slider-grp">
                <label className="header">Speed: {speed.toFixed(1)}x</label>
                <input 
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                />
            </div>

            <div className="slider-grp">
                <label className="header">Pitch: {pitch} semitones</label>
                <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={pitch}
                onChange={(e) => onPitchChange(parseFloat(e.target.value))}
                />
            </div>

            <div className="slider-grp">
                <label className="header">Reverb: {Math.round(reverbLevel*100)}%</label>
                <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={reverbLevel}
                onChange={(e) => onReverbChange(parseFloat(e.target.value))}
                />
            </div>
            <div className="slider-grp">
                <label className="header">Bass: {eq.bass} dB</label>
                <input
                type="range"
                min="-12"
                max="12"
                value={eq.bass}
                onChange={(e)=> onEqChange('bass',parseFloat(e.target.value))}
                />
                <label className="header">Mid: {eq.mid} dB</label>
                <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={eq.mid}
                onChange={(e) => onEqChange('mid', parseFloat(e.target.value))}
                />

                <label className="header">Treble: {eq.treble} dB</label>
                <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={eq.treble}
                onChange={(e)=> onEqChange('treble',parseFloat(e.target.value))}
                />


            </div>
        </div>
    )
}
export default AudioSettings;