import React from 'react';
import './Loader.css';

export default function Loader() {
  return (
    <div className="overlay">
        <div className="loading">
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
    </div>
    </div>
  )
}
