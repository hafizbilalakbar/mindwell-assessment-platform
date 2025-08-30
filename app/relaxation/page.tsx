"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Gamepad2, ArrowRight, Play, Sparkles, X, Maximize2, Minimize2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { games } from "@/data/games"
import { CosmicBackground } from "@/components/cosmic-background"
import "./relaxation.css"

// Add inline styles for game functionality
const gameStyles = `
  /* Game player styling */
  .game-fullscreen-container {
    position: relative;
    transition: all 0.3s ease;
    width: 100%;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  /* Fullscreen mode styling */
  .fullscreen-mode {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    z-index: 9999 !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    background-color: black !important;
  }
  
  /* Theater mode styling */
  .theater-mode {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    border-radius: 0 !important;
    position: relative !important;
    z-index: 10 !important;
    background-color: black !important;
  }
  
  /* YouTube-style theater mode container */
  .theater-mode-container {
    background: linear-gradient(to bottom, #0f0f0f, #1a1a1a) !important;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    position: relative !important;
    min-height: 80vh !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }
  
  /* When theater mode is active, adjust body background */
  body.theater-active {
    background-color: #0f0f0f !important;
    color: #fff !important;
  }
  
  /* Game info container in theater mode */
  body.theater-active .game-info-container {
    background: rgba(18, 18, 18, 0.8) !important;
    color: #fff !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  
  body.theater-active .game-info-container h3 {
    color: #fff !important;
  }
  
  body.theater-active .game-info-container p {
    color: #aaa !important;
  }
  
  /* Theater mode game container */
  .theater-mode {
    max-width: 1280px !important;
    margin: 0 auto !important;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.7) !important;
  }
  
  /* Theater mode gradients */
  .theater-mode-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
    pointer-events: none;
    z-index: 5;
  }
  
  .theater-mode-container::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    pointer-events: none;
    z-index: 5;
  }
  
  /* Make sure theater mode adapts to different screen sizes */
  @media (min-width: 1600px) {
    .theater-mode {
      max-width: 1440px !important;
      height: 810px !important; /* 16:9 ratio */
    }
  }
  
  @media (max-width: 1280px) {
    .theater-mode {
      max-width: 90vw !important;
      height: calc(90vw * 0.5625) !important; /* 16:9 ratio */
    }
  }
  
  @media (max-width: 768px) {
    .theater-mode {
      max-width: 100% !important;
      height: 56.25vw !important; /* 16:9 ratio */
    }
    
    .theater-mode-container {
      padding: 0 !important;
    }
  }
  
  /* Custom scrollbar for categories */
  .scrollbar-hide::-webkit-scrollbar {
    height: 6px;
    background: transparent;
  }
  
  .scrollbar-hide::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.4);
    border-radius: 20px;
  }
  
  .scrollbar-hide::-webkit-scrollbar-track {
    background: rgba(139, 92, 246, 0.1);
    border-radius: 20px;
  }
  
  /* For Firefox */
  .scrollbar-hide {
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 92, 246, 0.4) rgba(139, 92, 246, 0.1);
  }
  
  /* Shimmer effect for cards */
  .shimmer-card {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .shimmer-card:hover {
    box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.3);
  }
  
  .shine-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 2s infinite;
    pointer-events: none;
  }
  
  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
  
  .game-card-3d:hover .shine-effect {
    animation: shimmer 1.5s infinite;
  }

  body.fullscreen-active {
    overflow: hidden !important;
  }

  html.fullscreen-active {
    overflow: hidden !important;
  }

  /* Fixed buttons for size control - Always visible */
  .youtube-control-buttons {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 8px;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px;
    border-radius: 20px;
    pointer-events: auto; /* Enable pointer events specifically for control buttons */
  }
  
  .size-control-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    pointer-events: auto; /* Ensure buttons are clickable */
  }
  
  .size-control-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  /* YouTube-like controls - Improved */
  .youtube-controls-overlay {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 20;
    pointer-events: none; /* This allows clicks to pass through to the iframe */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .game-fullscreen-container:hover .youtube-controls-overlay {
    opacity: 1;
  }
  
  /* Always show controls on touch devices */
  @media (hover: none) {
    .youtube-controls-overlay {
      opacity: 1;
    }
    
    .youtube-title-overlay {
      opacity: 1;
    }
    
    .youtube-controls-container {
      opacity: 1 !important;
    }
    
    .youtube-top-controls {
      opacity: 1 !important;
    }
  }
  
  /* Make controls more visible on mobile */
  @media (max-width: 768px) {
    .youtube-controls-overlay {
      opacity: 1;
    }
    
    .youtube-title-overlay {
      opacity: 1;
    }
    
    .youtube-controls-container {
      bottom: 20px !important;
      right: 20px !important;
      opacity: 1 !important;
    }
    
    .youtube-control-button, 
    .youtube-close-button,
    .theater-mode-button,
    .size-control-btn {
      width: 44px !important;
      height: 44px !important;
      background: rgba(0, 0, 0, 0.75) !important;
    }
    
    .youtube-game-info {
      max-width: 75% !important;
      background: rgba(0, 0, 0, 0.75) !important;
      padding: 10px !important;
    }
    
    .youtube-top-controls {
      top: 10px !important;
      right: 10px !important;
      opacity: 1 !important;
    }
    
    .youtube-title-overlay {
      padding: 10px !important;
    }
    
    .youtube-control-buttons {
      opacity: 1 !important;
    }
  }
  
  /* Improved YouTube-style controls layout */
  .youtube-controls-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
    pointer-events: none;
  }
  
  /* Top gradient for title */
  .youtube-top-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.75), transparent);
    pointer-events: none;
  }

  .youtube-controls-container {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 12px;
    pointer-events: auto; /* Enable pointer events specifically for controls */
    z-index: 30;
    transition: opacity 0.3s ease;
    background: rgba(0, 0, 0, 0.5);
    padding: 6px;
    border-radius: 24px;
  }
  
  /* Top right controls */
  .youtube-top-controls {
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    gap: 12px;
    pointer-events: auto; /* Enable pointer events specifically for controls */
    z-index: 30;
    transition: opacity 0.3s ease;
    background: rgba(0, 0, 0, 0.4);
    padding: 6px;
    border-radius: 24px;
  }

  .youtube-control-button,
  .youtube-close-button,
  .theater-mode-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    pointer-events: auto; /* Ensure buttons are clickable */
  }

  .youtube-control-button:hover,
  .youtube-close-button:hover,
  .theater-mode-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  /* YouTube-like title */
  .youtube-title-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 15px;
    z-index: 25;
    pointer-events: none; /* Ensure title doesn't block interaction */
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .game-fullscreen-container:hover .youtube-title-overlay,
  .mobile-fullscreen .youtube-title-overlay {
    opacity: 1;
  }

  .youtube-title-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .youtube-game-info {
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.6);
    padding: 8px 12px;
    border-radius: 4px;
    max-width: 80%;
    overflow: hidden;
    margin-top: 45px;
  }
  
  /* Ensure title is visible in fullscreen */
  .fullscreen-mode .youtube-game-info {
    margin-top: 50px;
    background: rgba(0, 0, 0, 0.75);
  }
  
  /* YouTube-style control visibility */
  .game-fullscreen-container:not(:hover) .youtube-controls-overlay {
    opacity: 0;
  }
  
  .game-fullscreen-container:hover .youtube-controls-overlay {
    opacity: 1;
  }
  
  /* Only apply inactivity to desktop */
  @media (min-width: 769px) {
    .controls-inactive .youtube-controls-overlay {
      opacity: 0 !important;
    }
  }
  
  /* Keep controls visible when mouse is over them */
  .youtube-controls-container:hover,
  .youtube-top-controls:hover {
    opacity: 1 !important;
  }
  
  /* Ensure title adjusts on different screen sizes */
  @media (max-width: 480px) {
    .youtube-game-info {
      margin-top: 50px;
      max-width: 90%;
    }
    
    .youtube-game-info h3 {
      font-size: 14px;
    }
    
    .youtube-game-info p {
      font-size: 10px;
    }
  }
  
  @media (min-width: 481px) and (max-width: 768px) {
    .youtube-game-info {
      margin-top: 50px;
      max-width: 85%;
    }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    .youtube-game-info {
      margin-top: 50px;
      max-width: 80%;
    }
  }

  /* Loading animation */
  .loader {
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 5px solid #fff;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Animation for entrance/exit */
  .game-exit {
    animation: gameExit 0.3s forwards;
  }

  @keyframes gameExit {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  /* Neon glow effect for game container */
  .neon-glow {
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2);
    transition: box-shadow 0.3s ease;
  }

  .neon-glow:hover {
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.3);
  }

  /* Mobile optimization */
  .mobile-game-active .youtube-controls-overlay,
  .tablet-game-active .youtube-controls-overlay {
    opacity: 1;
  }

  .mobile-game-active .youtube-title-overlay {
    opacity: 1;
  }

  /* Controls fade effect */
  .fade-controls {
    animation: fadeControls 1s forwards;
  }

  @keyframes fadeControls {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  /* Fix for iframe interaction issues */
  .game-fullscreen-container iframe {
    border: 0;
    display: block;
  }

  /* Prevent scrolling when in fullscreen */
  body.mobile-fullscreen {
    position: fixed;
    width: 100%;
    height: 100%;
  }

  /* Add styles for preventing scroll issues */
  .prevent-scroll {
    overflow: hidden !important;
    position: fixed;
    width: 100%;
    height: 100%;
  }
  
  /* Make sure iframe doesn't cause scroll issues */
  iframe {
    display: block;
    border: 0;
  }

  /* Add a special class to handle interactions */
  .game-interaction-layer {
    position: absolute;
    inset: 0;
    z-index: 15; /* Between iframe and controls */
    pointer-events: none; /* By default, pass clicks through */
  }
  
  /* Only capture events when controls are visible */
  .game-fullscreen-container:hover .game-interaction-layer {
    pointer-events: auto; /* Capture events only when hovering */
  }
  
  /* But immediately pass through events on the game area */
  .game-interaction-layer:active {
    pointer-events: none; /* Pass clicks through when actively clicking */
  }
  
  /* Ensure mobile devices can interact with the game properly */
  @media (hover: none) {
    .game-interaction-layer {
      pointer-events: none !important; /* Always pass through on touch devices */
    }
  }
  
  /* Special handling for touch devices */
  .game-interaction-layer.touch-device {
    pointer-events: none !important; /* Always pass through on touch devices */
  }
  
  /* When controls are manually touched, temporarily enable them */
  .youtube-controls-container:active,
  .youtube-top-controls:active,
  .youtube-control-buttons:active {
    pointer-events: auto !important;
  }

  /* Fix for game interaction */
  .game-fullscreen-container.interacting {
    pointer-events: all !important;
  }
  
  .game-fullscreen-container.interacting iframe {
    pointer-events: all !important;
  }
  
  .game-fullscreen-container.interacting .control-element {
    pointer-events: none !important;
    opacity: 0 !important;
  }

  /* Game interaction layer */
  .game-interaction-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: auto;
  }
  
  /* When interacting, ensure pointer events go through */
  .game-interaction-layer.pointer-events-none {
    pointer-events: none !important;
  }
  
  /* For touch devices, optimize the interaction */
  .game-interaction-layer.touch-device {
    z-index: 5;
  }
  
  /* When in fullscreen, ensure the game is fully interactive */
  .fullscreen .game-interaction-layer {
    pointer-events: none !important;
  }

  /* External controls that don't interfere with game interaction */
  .external-controls-container {
    position: absolute;
    bottom: 0; /* Position at the bottom of the game container */
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 10px 0;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 0 0 12px 12px;
    transform: translateY(0); /* Show by default */
    transition: transform 0.3s ease;
    z-index: 100;
    pointer-events: auto; /* Allow interaction with controls */
  }
  
  .external-controls-container:hover {
    pointer-events: auto; /* Only capture clicks when hovering */
  }
  
  .game-fullscreen-container:hover .external-controls-container {
    transform: translateY(0); /* Show on hover */
  }
  
  .external-controls {
    display: flex;
    gap: 10px;
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 50px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    pointer-events: auto; /* Make sure controls are clickable */
  }
  
  .external-control-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .external-control-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  /* Side controls that appear on hover */
  .side-controls-container {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%) translateX(100%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 12px 0 0 12px;
    transition: transform 0.3s ease;
    z-index: 100;
  }
  
  .game-fullscreen-container:hover .side-controls-container {
    transform: translateY(-50%) translateX(0);
  }
  
  /* Title bar that appears on hover */
  .title-bar-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
    padding: 12px 20px;
    transform: translateY(0);
    transition: transform 0.3s ease;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none; /* Don't block interaction */
  }
  
  .game-fullscreen-container:hover .title-bar-container {
    transform: translateY(0);
  }
  
  .game-title-info {
    color: white;
    max-width: 70%;
  }
  
  .game-title-info h3 {
    font-size: 18px;
    margin: 0;
    font-weight: 600;
  }
  
  .game-title-info p {
    font-size: 14px;
    margin: 0;
    opacity: 0.8;
  }
  
  /* Floating close button */
  .floating-close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 100;
    opacity: 1;
    pointer-events: auto; /* Enable interaction */
  }
  
  .game-fullscreen-container:hover .floating-close-button {
    opacity: 1;
    pointer-events: auto; /* Enable interaction on hover */
  }
  
  .floating-close-button:hover {
    background: rgba(255, 0, 0, 0.7);
    transform: scale(1.1);
  }
  
  /* Make sure iframe has full interaction */
  .game-fullscreen-container iframe {
    pointer-events: auto !important;
    z-index: 1;
  }
`;

// Remove metadata from this client component
// export const metadata = {
//   title: "MindWell Relaxation Zone - Interactive Games for Mental Wellbeing",
//   description: "Explore our collection of relaxing games and activities designed to reduce stress and improve mental wellbeing. Discover puzzles, sports games, and more.",
//   keywords: ["relaxation games", "mental wellbeing", "stress relief", "mindfulness activities", "puzzle games", "sports games"],
// };

// Game Visualization Component
const GameVisualization = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 dark:from-purple-900/60 dark:to-indigo-900/60 flex items-center justify-center">
      {/* Mobile device frame */}
      <div className="relative w-[80%] h-[90%] bg-gray-900 dark:bg-gray-950 rounded-[2rem] border-[8px] border-gray-800 dark:border-gray-900 shadow-2xl overflow-hidden">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-black flex items-center justify-between px-4 z-10">
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="text-white text-[10px]">12:34</div>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/4 h-5 bg-black rounded-b-xl z-20"></div>
        
        {/* Game screen */}
        <div className="absolute inset-0 mt-6 overflow-hidden bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-pink-600/20">
          {/* MindWell logo */}
          <motion.div 
            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">MindWell</h3>
            <p className="text-[10px] text-white/70">Relaxation Games</p>
          </motion.div>
          
          {/* Game grid */}
          <div className="absolute top-16 left-0 right-0 bottom-12 overflow-hidden px-3">
            <div className="grid grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`game-card-${i}`}
                  className="aspect-square bg-gradient-to-br from-purple-600/80 to-indigo-600/80 rounded-lg overflow-hidden shadow-lg border border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative h-full w-full">
                    {/* Game preview */}
                    <div className="h-3/4 overflow-hidden">
                      {i % 3 === 0 && (
                        <motion.div className="w-full h-full bg-purple-700 flex items-center justify-center"
                          animate={{ background: ['rgba(124, 58, 237, 0.8)', 'rgba(79, 70, 229, 0.8)', 'rgba(124, 58, 237, 0.8)'] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <motion.div 
                            className="w-12 h-12 rounded-full border-4 border-white/80 border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                      )}
                      {i % 3 === 1 && (
                        <motion.div className="w-full h-full bg-indigo-700 flex items-center justify-center gap-2">
                          {[...Array(3)].map((_, j) => (
                            <motion.div 
                              key={`dot-${j}`}
                              className="w-2 h-2 rounded-full bg-white"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, delay: j * 0.2, repeat: Infinity }}
                            />
                          ))}
                        </motion.div>
                      )}
                      {i % 3 === 2 && (
                        <motion.div className="w-full h-full bg-blue-700 flex items-center justify-center">
                          <motion.div 
                            className="grid grid-cols-3 grid-rows-3 gap-1"
                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                          >
                            {[...Array(9)].map((_, j) => (
                              <motion.div 
                                key={`pixel-${j}`}
                                className="w-2 h-2 bg-white/80 rounded-sm"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 2, delay: j * 0.1, repeat: Infinity }}
                              />
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Game title */}
                    <div className="h-1/4 bg-black/30 backdrop-blur-sm p-1 flex flex-col justify-center">
                      <p className="text-[8px] text-white font-medium truncate">
                        {["Mindful Puzzle", "Calm Match", "Focus Flow", "Zen Blocks", "Breath Bounce", "Mind Maze"][i]}
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, j) => (
                          <svg key={`star-${j}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-2 h-2 ${j < 4 ? "text-yellow-400" : "text-gray-400"}`}>
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    
                    {/* Animated overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-600/30 pointer-events-none"
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Navigation bar */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/50 backdrop-blur-md flex items-center justify-around px-4">
            <motion.div 
              className="text-white opacity-80 flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
              <span className="text-[8px] mt-0.5">Home</span>
            </motion.div>
            <motion.div 
              className="text-purple-400 flex flex-col items-center"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
              </svg>
              <span className="text-[8px] mt-0.5">Games</span>
            </motion.div>
            <motion.div 
              className="text-white opacity-80 flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
              <span className="text-[8px] mt-0.5">Profile</span>
            </motion.div>
          </div>
        </div>
        
        {/* Reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        
        {/* Play button overlay */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          onClick={onClick}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className="flex flex-col items-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-purple-600/90 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <p className="text-white font-bold mt-2 text-lg">Explore Games</p>
          </motion.div>
        </motion.div>
        
        {/* Scanning light effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/20 to-white/0 h-[20%] pointer-events-none"
          animate={{ top: ["-20%", "120%", "-20%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </div>
    </div>
  );
};

// Add screen size mode types
type ScreenSizeMode = 'default' | 'theater' | 'fullscreen';

// Helper function to format category
const formatCategory = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Get unique categories
const getCategories = () => {
  const categories = games.map(game => game.category);
  return ["all", ...new Set(categories)];
};

// Game component
export default function RelaxationPage() {
  // State for active game
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isGameLoading, setIsGameLoading] = useState(false)
  const [gameHeight, setGameHeight] = useState("56.25%") // Default 16:9 ratio
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const [showDoubleTapHint, setShowDoubleTapHint] = useState(false)
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const categories = getCategories();

  // React hook for managing inactivity tracking
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    if (activeGame && gameContainerRef.current) {
      cleanup = setupMouseInactivityTracking();
    }
    
    // Cleanup when component unmounts or game changes
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [activeGame]);

  // Handle play game
  const handlePlayGame = (gameId: string) => {
    // Prevent default behavior that might cause navigation
    try {
      setActiveGame(gameId)
      setIsGameLoading(true)
      
      // Ensure we're at the top of the page
      window.scrollTo({ top: 0, behavior: "smooth" })
      
      // Add a small delay to ensure state is updated before rendering iframe
      setTimeout(() => {
        if (gameContainerRef.current) {
          adjustGameHeight()
          
          // Set up mouse inactivity tracking for YouTube-style controls
          setupMouseInactivityTracking();
        }
      }, 100)
    } catch (error) {
      console.error("Error loading game:", error)
    }
  }
  
  // Setup YouTube-style mouse inactivity tracking
  const setupMouseInactivityTracking = () => {
    if (!gameContainerRef.current) return;
    
    let inactivityTimer: NodeJS.Timeout;
    let isMouseMoving = false;
    
    // Reset timer on mouse move
    const handleMouseMove = () => {
      isMouseMoving = true;
      
      // Remove inactive class immediately
      gameContainerRef.current?.classList.remove('controls-inactive');
      
      // Clear existing timer
      clearTimeout(inactivityTimer);
      
      // Set new timer
      inactivityTimer = setTimeout(() => {
        if (gameContainerRef.current && !isMouseMoving) {
          gameContainerRef.current.classList.add('controls-inactive');
        }
        isMouseMoving = false;
      }, 2500);
    };
    
    // Add event listeners
    gameContainerRef.current.addEventListener('mousemove', handleMouseMove);
    
    // Clean up when game is closed
    const cleanup = () => {
      if (gameContainerRef.current) {
        gameContainerRef.current.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(inactivityTimer);
      }
    };
    
    // Store cleanup function for later
    return cleanup;
  };

  // Toggle theater mode (YouTube-style)
  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
    
    if (isFullscreen) {
      // Exit fullscreen first if in fullscreen mode
      toggleFullscreen();
      
      setTimeout(() => {
        setIsTheaterMode(true);
      }, 300);
    }
    
    // Apply additional styling for YouTube-like theater mode
    setTimeout(() => {
      if (mainContainerRef.current) {
        if (!isTheaterMode) {
          // Going into theater mode - we check !isTheaterMode because state hasn't updated yet
          document.body.style.backgroundColor = "#0f0f0f";
          document.body.classList.add("theater-active");
          mainContainerRef.current.style.background = "linear-gradient(to bottom, #0f0f0f, #1a1a1a)";
        } else {
          // Exiting theater mode
          document.body.style.backgroundColor = "";
          document.body.classList.remove("theater-active");
          mainContainerRef.current.style.background = "";
        }
      }
      adjustGameHeight();
    }, 50);
  };

  // Handle close game
  const handleCloseGame = () => {
    if (gameContainerRef.current) {
      // Add exit animation class
      gameContainerRef.current.classList.add('game-exit');
      
      // Make sure to reset all scrolling and positioning styles
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('fullscreen-active');
      document.body.classList.remove('mobile-fullscreen');
      document.body.classList.remove('mobile-game-active');
      document.body.classList.remove('tablet-game-active');
      document.body.classList.remove('prevent-scroll');
      document.body.classList.remove('controls-inactive');
      
      // Exit fullscreen if active
      if (isFullscreen) {
        try {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
          } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
          }
        } catch (err) {
          console.log('Error exiting fullscreen', err);
        }
      }
      
      // Wait for animation to complete before removing the game
      setTimeout(() => {
        setActiveGame(null);
        setIsFullscreen(false);
        setIsTheaterMode(false);
        
        // Force scroll reset to fix any stuck scroll issues
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        
        // Force reflow
        void document.body.offsetHeight;
      }, 300); // Match the animation duration
    } else {
      setActiveGame(null);
      setIsFullscreen(false);
      setIsTheaterMode(false);
    }
  }

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsGameLoading(false);
    
    // Apply our iframe click fix
    setTimeout(() => {
      // Fix for iframe coordinate mapping issue
      if (!activeGame) return;
      
      try {
        // Get the iframe element
        const iframe = document.querySelector('iframe');
        if (!iframe) return;
        
        // Make sure the iframe can receive clicks
        iframe.style.pointerEvents = 'auto';
        
        // Add a class to the game container to indicate interaction is possible
        const gameContainer = gameContainerRef.current;
        if (gameContainer) {
          gameContainer.classList.add('interacting');
          
          // Make sure any overlay elements don't block interaction
          const overlays = gameContainer.querySelectorAll('.youtube-controls-overlay');
          overlays.forEach(overlay => {
            (overlay as HTMLElement).style.pointerEvents = 'none';
          });
          
          // Ensure controls only appear on hover and don't block clicks
          const controlsElements = gameContainer.querySelectorAll('.youtube-controls-container, .youtube-top-controls');
          controlsElements.forEach(element => {
            (element as HTMLElement).style.pointerEvents = 'auto';
          });
        }
      } catch (error) {
        console.error("Error fixing iframe click issue:", error);
      }
    }, 500);
  };

  // Handle explore all games
  const handleExploreAllGames = () => {
    // Scroll to games section
    const gamesSection = document.getElementById('games-section');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Detect touch devices and optimize iframe interaction
  useEffect(() => {
    if (!activeGame) return;
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const gameContainer = gameContainerRef.current;
    
    if (isTouchDevice && gameContainer) {
      // For touch devices, optimize the interaction
      const interactionLayer = gameContainer.querySelector('.game-interaction-layer');
      if (interactionLayer) {
        interactionLayer.classList.add('touch-device');
        
        // Add special handling for touch devices
        const handleTouchStart = (e: TouchEvent) => {
          // Check if the touch is on a control element
          const target = e.target as HTMLElement;
          const isControlElement = target.closest('.youtube-control-buttons, .youtube-controls-container, .youtube-top-controls');
          
          if (!isControlElement) {
            // If not touching a control, ensure the interaction layer doesn't block
            interactionLayer.classList.add('pointer-events-none');
          }
        };
        
        document.addEventListener('touchstart', handleTouchStart);
        return () => {
          document.removeEventListener('touchstart', handleTouchStart);
        };
      }
    }
  }, [activeGame]);

  // Handle game interaction with smart controls
  const [showControls, setShowControls] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Smart controls that only appear when mouse is near edges
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameContainerRef.current || isInteracting) return;
    
    const rect = gameContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    // Calculate distances from edges (as percentages)
    const edgeThreshold = 80; // pixels from edge to activate controls
    const isNearEdge = 
      x < edgeThreshold || // left edge
      y < edgeThreshold || // top edge
      x > rect.width - edgeThreshold || // right edge
      y > rect.height - edgeThreshold; // bottom edge
    
    setMousePosition({ x, y });
    
    // Show controls when near edge, hide otherwise
    setShowControls(isNearEdge);
    
    // Clear any existing timeout
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    // Set a timeout to hide controls after inactivity
    if (isNearEdge) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide after 3 seconds of inactivity
      
      setControlsTimeout(timeout);
    }
  };
  
  // Handle mouse down on game area - sets interacting state
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only set interacting if not clicking on a control
    const target = e.target as HTMLElement;
    const isControlElement = target.closest('button, .control-element');
    
    if (!isControlElement) {
      setIsInteracting(true);
      // Hide controls immediately when interacting with game
      setShowControls(false);
    }
  };
  
  // Handle mouse up - reset interacting state
  const handleMouseUp = () => {
    setIsInteracting(false);
  };
  
  // Add global mouse up handler
  useEffect(() => {
    if (!activeGame) return;
    
    const handleGlobalMouseUp = () => {
      setIsInteracting(false);
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [activeGame]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // Handle touch events for mobile devices
  useEffect(() => {
    if (!activeGame) return;
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;
    
    // For touch devices, we'll show controls briefly when the game loads
    setShowControls(true);
    
    // Then hide them after a few seconds
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    // Add touch event listeners to show controls
    const handleTouchStart = () => {
      // Toggle controls on tap
      setShowControls(prev => !prev);
      
      // Hide controls after a delay
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const newTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimeout(newTimeout);
    };
    
    // Add listener to game container
    const gameContainer = gameContainerRef.current;
    if (gameContainer) {
      gameContainer.addEventListener('touchstart', handleTouchStart);
    }
    
    return () => {
      clearTimeout(timeout);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      if (gameContainer) {
        gameContainer.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [activeGame, controlsTimeout]);

  // Handle double tap for fullscreen on mobile
  const [lastTapTime, setLastTapTime] = useState(0);
  
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ms
    
    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      // Double tap detected - toggle fullscreen
      toggleFullscreen();
    }
    
    setLastTapTime(now);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!gameContainerRef.current) return;
    
    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (gameContainerRef.current.requestFullscreen) {
          gameContainerRef.current.requestFullscreen();
        } else if ((gameContainerRef.current as any).webkitRequestFullscreen) {
          (gameContainerRef.current as any).webkitRequestFullscreen();
        } else if ((gameContainerRef.current as any).msRequestFullscreen) {
          (gameContainerRef.current as any).msRequestFullscreen();
        }
        
        // Add fullscreen class
        gameContainerRef.current.classList.add('fullscreen-mode');
        document.body.classList.add('fullscreen-active');
        document.documentElement.classList.add('fullscreen-active');
        
        // For mobile devices, add special handling
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          document.body.classList.add('mobile-fullscreen');
        }
        
        setIsFullscreen(true);
        
        // Exit theater mode if active
        if (isTheaterMode) {
          setIsTheaterMode(false);
          document.body.classList.remove('theater-active');
          if (mainContainerRef.current) {
            mainContainerRef.current.style.background = "";
          }
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
        
        // Remove fullscreen class
        gameContainerRef.current.classList.remove('fullscreen-mode');
        document.body.classList.remove('fullscreen-active');
        document.documentElement.classList.remove('fullscreen-active');
        document.body.classList.remove('mobile-fullscreen');
        
        setIsFullscreen(false);
      }
      
      // Adjust height after mode change
      setTimeout(adjustGameHeight, 300);
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  // Adjust game height based on aspect ratio
  const adjustGameHeight = () => {
    if (!gameContainerRef.current || !activeGame) return;
    
    try {
      // If in fullscreen or theater mode, use special handling
      if (isFullscreen) {
        setGameHeight("100%");
        return;
      }
      
      if (isTheaterMode) {
        // Theater mode uses a 16:9 aspect ratio with max width
        const theaterHeight = window.innerWidth <= 768
          ? "56.25vw" // Mobile: 16:9 ratio of viewport width
          : "calc(90vh - 120px)"; // Desktop: 90% of viewport height minus margins
        
        setGameHeight(theaterHeight);
        return;
      }
      
      // Default mode: 16:9 aspect ratio
      setGameHeight("56.25%"); // 9/16 = 0.5625 or 56.25%
    } catch (error) {
      console.error("Error adjusting game height:", error);
      // Fallback to default aspect ratio
      setGameHeight("56.25%");
    }
  };

  // Get game URL with proper parameters
  const getGameUrl = (gameId: string | null) => {
    if (!gameId) return "";
    
    const game = games.find(g => g.id === gameId);
    if (!game) return "";
    
    // Add parameters to help with iframe communication
    let url = game.url;
    
    // Add a parameter to indicate this is running in our app
    if (url.includes('?')) {
      url += '&mindwell=true';
    } else {
      url += '?mindwell=true';
    }
    
    return url;
  };

  // Listen for window resize to adjust game height
  useEffect(() => {
    if (!activeGame) return;
    
    const handleResize = () => {
        adjustGameHeight();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial adjustment
    adjustGameHeight();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeGame, isFullscreen, isTheaterMode]);

  // Handle fullscreen change events from browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      
      // Update state if fullscreen state changed externally (e.g., Esc key)
      if (isFullscreen !== isDocFullscreen) {
        setIsFullscreen(isDocFullscreen);
        
        if (!isDocFullscreen && gameContainerRef.current) {
          gameContainerRef.current.classList.remove('fullscreen-mode');
          document.body.classList.remove('fullscreen-active');
          document.documentElement.classList.remove('fullscreen-active');
        }
        
        // Adjust height after mode change
        setTimeout(adjustGameHeight, 300);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Filter games based on active category
  const filteredGames = games.filter(game => 
    activeCategory === "all" ? true : game.category === activeCategory
  );

  // Get active game details
  const activeGameDetails = activeGame ? games.find(game => game.id === activeGame) : null;

  return (
    <div ref={mainContainerRef} className="relaxation-page min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <Navbar />
      
      {/* Add style tag with game-related CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        ${gameStyles}

        /* Additional styles for YouTube-like screen modes */
        .theater-mode {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
          position: relative !important;
          z-index: 10 !important;
          background-color: black !important;
        }

        .screen-size-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .screen-size-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .screen-size-button {
            width: 44px;
            height: 44px;
            background: rgba(0, 0, 0, 0.75);
          }
        }

        /* Game description styles */
        .game-info-container {
          background: white;
          border-radius: 0.75rem;
          margin-top: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .game-info-container {
          background: rgba(31, 41, 55, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(75, 85, 99, 0.4);
        }

        /* YouTube-style theater mode container */
        .theater-mode-container {
          background: linear-gradient(to bottom, #0f0f0f, #1a1a1a) !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          position: relative !important;
          min-height: 80vh !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }
        
        /* When theater mode is active, adjust body background */
        body.theater-active {
          background-color: #0f0f0f !important;
          color: #fff !important;
        }
        
        /* Game info container in theater mode */
        body.theater-active .game-info-container {
          background: rgba(18, 18, 18, 0.8) !important;
          color: #fff !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        
        body.theater-active .game-info-container h3 {
          color: #fff !important;
        }
        
        body.theater-active .game-info-container p {
          color: #aaa !important;
        }
        
        /* Theater mode game container */
        .theater-mode {
          max-width: 1280px !important;
          margin: 0 auto !important;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.7) !important;
        }
        
        /* Theater mode gradients */
        .theater-mode-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
          pointer-events: none;
          z-index: 5;
        }
        
        .theater-mode-container::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          pointer-events: none;
          z-index: 5;
        }
        
        /* Make sure theater mode adapts to different screen sizes */
        @media (min-width: 1600px) {
          .theater-mode {
            max-width: 1440px !important;
            height: 810px !important; /* 16:9 ratio */
          }
        }
        
        @media (max-width: 1280px) {
          .theater-mode {
            max-width: 90vw !important;
            height: calc(90vw * 0.5625) !important; /* 16:9 ratio */
          }
        }
        
        @media (max-width: 768px) {
          .theater-mode {
            max-width: 100% !important;
            height: 56.25vw !important; /* 16:9 ratio */
          }
          
          .theater-mode-container {
            padding: 0 !important;
          }
        }
      `}} />
      
      {activeGame ? (
        /* Game Playing View */
        <section className={`game-page-container relative py-8 px-4 mx-auto ${isTheaterMode ? 'theater-mode-container' : 'max-w-7xl'}`}>
          {/* Game container with integrated title */}
          <div
            ref={gameContainerRef}
            className={`game-fullscreen-container youtube-player relative mx-auto mb-6 rounded-xl overflow-hidden shadow-xl neon-glow ${isTheaterMode ? 'theater-mode' : ''} ${isInteracting ? 'interacting' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            {isGameLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                <div className="loader"></div>
              </div>
            )}
            
            <iframe 
              ref={(iframe) => {
                if (iframe && activeGame) {
                  // Set up simple onload handler
                  iframe.onload = () => {
                    setIsGameLoading(false);
                  };
                }
              }}
              src={getGameUrl(activeGame)} 
              title={activeGameDetails?.name || "Game"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute inset-0 w-full h-full"
              style={{ 
                pointerEvents: 'auto', // Always allow interaction with iframe
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                zIndex: 1
              }}
            ></iframe>

            {/* Transparent click overlay to fix coordinate mapping */}
            <div 
              className="absolute inset-0 z-2" 
              style={{
                pointerEvents: 'none', // By default, pass clicks through to the iframe
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            ></div>

            {/* External controls container (appears on hover) */}
            <div 
              className="external-controls-container"
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                transform: 'translateY(0)',
                background: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '0 0 12px 12px',
                padding: '6px',
                display: 'flex',
                justifyContent: 'center',
                zIndex: '30',
                opacity: '1'
              }}
            >
              <div className="external-controls" style={{ display: 'flex', gap: '8px' }}>
                {!isFullscreen && (
                  <button
                    onClick={toggleTheaterMode}
                    className="external-control-button"
                    aria-label={isTheaterMode ? "Default View" : "Theater Mode"}
                   style={{
                     width: '40px',
                     height: '40px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     borderRadius: '50%',
                     background: 'rgba(0, 0, 0, 0.6)',
                     color: 'white',
                     border: 'none',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                  >
                    {isTheaterMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <rect x="4" y="8" width="16" height="8" rx="1" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <rect x="2" y="7" width="20" height="10" rx="1" />
                      </svg>
                    )}
                  </button>
                )}
                
                <button 
                  onClick={toggleFullscreen}
                  className="external-control-button"
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                 style={{
                   width: '40px',
                   height: '40px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   borderRadius: '50%',
                   background: 'rgba(0, 0, 0, 0.6)',
                   color: 'white',
                   border: 'none',
                   cursor: 'pointer',
                   transition: 'all 0.2s ease'
                 }}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Floating close button */}
                <button 
                  onClick={handleCloseGame}
              className="floating-close-button"
                  aria-label="Close Game"
               style={{
                 top: '15px',
                 right: '15px',
                 width: '40px',
                 height: '40px',
                 position: 'absolute',
                 borderRadius: '50%',
                 background: 'rgba(0, 0, 0, 0.6)',
                 color: 'white',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 cursor: 'pointer',
                 transition: 'all 0.2s ease',
                 zIndex: '100',
                 border: 'none'
               }}
                >
                  <X className="h-5 w-5" />
                </button>
            
            {/* Title bar that appears on hover */}
            <div className="title-bar-container">
              <div className="game-title-info">
                <h3>{activeGameDetails?.name || "Game"}</h3>
                <p>{formatCategory(activeGameDetails?.category || "")}</p>
              </div>
              </div>
              
            {/* Mobile-specific controls that are always visible on touch devices */}
            <div className="md:hidden fixed bottom-4 right-4 z-50 flex gap-2">
                  <button 
                    onClick={toggleFullscreen}
                className="w-12 h-12 rounded-full bg-black/80 hover:bg-black/90 flex items-center justify-center text-white shadow-lg"
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                  <Minimize2 className="h-6 w-6" />
                    ) : (
                  <Maximize2 className="h-6 w-6" />
                    )}
                  </button>
                </div>
            
            {/* Mobile instruction hint */}
            {showDoubleTapHint && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-black/80 rounded-lg p-4 shadow-lg max-w-[80%] text-center">
                  <p className="text-white text-sm font-medium">
                    Tap the edges for controls<br/>
                    Double-tap for fullscreen
                  </p>
              </div>
            </div>
            )}
          </div>
          
          {/* Game description below the game */}
          <div className="game-info-container">
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 dark:from-purple-400 dark:via-pink-300 dark:to-indigo-400">
              Game Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {activeGameDetails?.description || "Loading game description..."}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. play time: 5-10 min</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty: {activeGameDetails?.category === "puzzle" ? "Medium" : "Easy"}</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Focus: Mindfulness & Relaxation</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Game Selection View */
        <>
          {/* Hero Section with Modern Animated Design */}
          <section className="hero-container relative overflow-hidden py-16 sm:py-24">
            {/* Background glowing gradient */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[100px] dark:bg-purple-700/30"
                animate={{ 
                  x: ["-10%", "10%", "-10%"],
                  y: ["-10%", "10%", "-10%"]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                style={{ top: "25%", left: "25%" }}
              />
              <motion.div
                className="absolute w-1/3 h-1/3 bg-indigo-600/15 rounded-full blur-[100px] dark:bg-indigo-700/25"
                animate={{ 
                  x: ["10%", "-10%", "10%"],
                  y: ["5%", "-5%", "5%"]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                style={{ top: "50%", right: "15%" }}
              />
              <motion.div
                className="absolute w-1/4 h-1/4 bg-pink-600/10 rounded-full blur-[100px] dark:bg-pink-700/20"
                animate={{ 
                  x: ["-5%", "5%", "-5%"],
                  y: ["7%", "-7%", "7%"]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                style={{ bottom: "20%", left: "40%" }}
              />
            </div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path
                    d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z"
                    fill="url(#gradient1)"
                    animate={{
                      d: [
                        "M0,50 Q25,30 50,50 T100,50 V100 H0 Z",
                        "M0,45 Q25,35 50,45 T100,45 V100 H0 Z",
                        "M0,50 Q25,40 50,50 T100,50 V100 H0 Z",
                        "M0,55 Q25,45 50,55 T100,55 V100 H0 Z",
                        "M0,50 Q25,30 50,50 T100,50 V100 H0 Z"
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" className="dark:stop-color-purple-600" />
                      <stop offset="100%" stopColor="rgba(99, 102, 241, 0.3)" className="dark:stop-color-indigo-600" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Horizontal gradient lines */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 2, delay: 1 }}
                  className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 2, delay: 1.5 }}
                  className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"
                />
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-16 h-16 opacity-20">
                  <motion.div
                    className="w-full h-full rounded-full bg-purple-400 dark:bg-purple-600 blur-xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      x: [0, 30, 0],
                      y: [0, -30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="absolute top-3/4 left-3/4 w-24 h-24 opacity-20">
                  <motion.div
                    className="w-full h-full rounded-full bg-indigo-400 dark:bg-indigo-600 blur-xl"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      x: [0, -40, 0],
                      y: [0, 20, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="absolute top-1/2 left-2/3 w-20 h-20 opacity-20">
                  <motion.div
                    className="w-full h-full rounded-full bg-pink-400 dark:bg-pink-600 blur-xl"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      x: [0, 20, 0],
                      y: [0, 40, 0]
                    }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                
                {/* Adding more floating elements for enhanced visual appeal */}
                <div className="absolute top-1/3 right-1/4 w-12 h-12 opacity-15">
                  <motion.div
                    className="w-full h-full rounded-full bg-blue-400 dark:bg-blue-600 blur-xl"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      x: [0, -15, 0],
                      y: [0, -25, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="absolute bottom-1/4 left-1/3 w-14 h-14 opacity-15">
                  <motion.div
                    className="w-full h-full rounded-full bg-violet-400 dark:bg-violet-600 blur-xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      x: [0, 25, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                
                {/* Subtle geometric shapes */}
                <div className="absolute top-1/6 left-1/6 opacity-10">
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-purple-300 to-indigo-400 dark:from-purple-500 dark:to-indigo-600 rotate-45 blur-sm"
                    animate={{ 
                      rotate: [45, 60, 45],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="absolute bottom-1/6 right-1/6 opacity-10">
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-tr from-pink-300 to-purple-400 dark:from-pink-500 dark:to-purple-600 rounded-full blur-sm"
                    animate={{ 
                      scale: [1, 1.15, 1],
                      x: [0, -10, 0],
                      y: [0, 10, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
              
              {/* Adding animated radial gradient overlay */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent to-white/5 dark:to-black/20 mix-blend-overlay"></div>
              
              {/* Animated grid lines for modern tech feel */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full grid grid-cols-12 gap-4">
                  {Array(12).fill(0).map((_, i) => (
                    <motion.div 
                      key={`col-${i}`} 
                      className="h-full w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent"
                      initial={{ opacity: 0, height: "0%" }}
                      animate={{ opacity: 0.3, height: "100%" }}
                      transition={{ duration: 1.5, delay: i * 0.05 }}
                    />
                  ))}
                </div>
                <div className="h-full w-full grid grid-rows-12 gap-4">
                  {Array(12).fill(0).map((_, i) => (
                    <motion.div 
                      key={`row-${i}`} 
                      className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                      initial={{ opacity: 0, width: "0%" }}
                      animate={{ opacity: 0.3, width: "100%" }}
                      transition={{ duration: 1.5, delay: i * 0.05 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-12 lg:mb-0 text-center lg:text-left"
                >
                  <motion.div
                    className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-purple-100 dark:bg-purple-900/30 backdrop-blur-md border border-purple-200 dark:border-purple-700/50 shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { repeat: Infinity, duration: 10, ease: "linear" },
                        scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                      }}
                    >
                      <Gamepad2 className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 dark:text-purple-400" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mb-4"
                  >
                    <h2 className="text-xl md:text-2xl font-semibold text-purple-600 dark:text-purple-400 tracking-wide uppercase">
                      MindWell Interactive
                    </h2>
                  </motion.div>
                  
                  <motion.h1
                    className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 dark:from-purple-400 dark:via-pink-300 dark:to-indigo-400 drop-shadow-sm"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    <motion.span
                      className="inline-block"
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundSize: "300% 100%",
                        backgroundImage: "linear-gradient(90deg, #9333ea, #ec4899, #6366f1, #9333ea)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                      }}
                    >
                      Relaxation Games
                    </motion.span>
                    <span className="block text-3xl sm:text-4xl md:text-5xl text-gray-800 dark:text-gray-200 mt-2">
                      Interactive Collection
                    </span>
                  </motion.h1>
                  
                  <motion.div
                    className="relative h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 mx-auto lg:mx-0 mb-8 rounded-full overflow-hidden"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "60%", opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/30"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                  
                  <motion.p
                    className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                  >
                    Discover interactive games designed to reduce stress and improve your mental wellbeing.
                  </motion.p>
                  
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  >
                    <Button
                      onClick={handleExploreAllGames}
                      className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-700 text-white font-medium px-8 py-6 text-lg shadow-lg shadow-purple-500/20 dark:shadow-purple-900/30 rounded-full group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Explore Games
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <motion.span 
                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0"
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/relaxation")}
                      className="border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-medium px-8 py-6 text-lg rounded-full relative overflow-hidden group"
                    >
                      <span className="relative z-10">Learn More</span>
                      <motion.span 
                        className="absolute inset-0 w-0 h-full bg-purple-100 dark:bg-purple-900/30 group-hover:w-full transition-all duration-300 -z-10 rounded-full"
                      />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Right Interactive Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="relative flex justify-center lg:justify-end"
                >
                  <div className="relative">
                    {/* Interactive game visualization instead of GIF */}
                    <motion.div 
                      className="relative w-80 h-80 sm:w-96 sm:h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400/80 via-blue-500/80 to-indigo-600/80 dark:from-purple-600/80 dark:via-blue-700/80 dark:to-indigo-800/80 shadow-2xl"
                      initial={{ rotateY: 25 }}
                      animate={{ rotateY: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                      style={{ 
                        transformStyle: "preserve-3d",
                        perspective: "1000px"
                      }}
                    >
                      {/* Glass morphism effect */}
                      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10 dark:bg-black/10"></div>
                      
                      {/* Content inside container */}
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <motion.div 
                          className="w-full h-full rounded-lg overflow-hidden relative"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 1, delay: 0.6 }}
                        >
                          {/* Animated overlay effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 z-10 mix-blend-overlay"></div>
                          
                          {/* Animated scanning line effect */}
                          <motion.div 
                            className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-white/70 to-transparent z-20"
                            animate={{ 
                              top: ["0%", "100%", "0%"],
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                          ></motion.div>
                          
                          {/* Mobile device frame with games */}
                          <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 dark:from-purple-900/60 dark:to-indigo-900/60 flex items-center justify-center">
                            {/* Phone frame */}
                            <div className="relative w-[70%] h-[85%] bg-gray-900 rounded-[2rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden">
                              {/* Status bar */}
                              <div className="h-5 bg-black flex items-center justify-between px-4">
                                <div className="text-white text-[8px]">12:34</div>
                                <div className="flex space-x-1">
                                  <div className="w-1 h-1 bg-white rounded-full"></div>
                                  <div className="w-1 h-1 bg-white rounded-full"></div>
                                  <div className="w-1 h-1 bg-white rounded-full"></div>
                                </div>
                              </div>
                              
                              {/* Screen content */}
                              <div className="h-[calc(100%-5px)] bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-pink-600/20 p-3">
                                {/* App header */}
                                <div className="text-center mb-2">
                                  <h3 className="text-sm font-bold text-white">MindWell Games</h3>
                                  <div className="h-0.5 w-12 bg-purple-500/50 mx-auto rounded-full mt-1"></div>
                                </div>
                                
                                {/* Games grid */}
                                <div className="grid grid-cols-2 gap-2">
                                  {[...Array(6)].map((_, i) => (
                                    <motion.div
                                      key={`game-${i}`}
                                      className="aspect-square bg-gradient-to-br from-purple-600/80 to-indigo-600/80 rounded-lg overflow-hidden relative"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.5, delay: i * 0.1 }}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      {/* Game animation */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        {i % 3 === 0 && (
                                          <motion.div 
                                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                          />
                                        )}
                                        {i % 3 === 1 && (
                                          <div className="flex space-x-1">
                                            {[...Array(3)].map((_, j) => (
                                              <motion.div 
                                                key={`dot-${j}`}
                                                className="w-1.5 h-1.5 bg-white rounded-full"
                                                animate={{ y: [0, -3, 0] }}
                                                transition={{ duration: 0.6, delay: j * 0.2, repeat: Infinity }}
                                              />
                                            ))}
                                          </div>
                                        )}
                                        {i % 3 === 2 && (
                                          <motion.div 
                                            className="w-6 h-6 bg-white/20 rounded-md"
                                            animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                          />
                                        )}
                                      </div>
                                      
                                      {/* Game title */}
                                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-center">
                                        <p className="text-[8px] text-white truncate">Game {i+1}</p>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                                
                                {/* Bottom navbar */}
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/30 flex justify-around items-center">
                                  {['home', 'games', 'profile'].map((item, i) => (
                                    <motion.div 
                                      key={item}
                                      className={`flex flex-col items-center ${i === 1 ? 'text-purple-400' : 'text-white/70'}`}
                                      animate={i === 1 ? { y: [0, -2, 0] } : {}}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                      <div className="w-1 h-1 bg-current rounded-full mb-0.5"></div>
                                      <div className="text-[6px]">{item}</div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Scan effect */}
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-white/0 h-[20%] pointer-events-none"
                                animate={{ top: ["-20%", "120%", "-20%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                              />
                            </div>
                            
                            {/* Play button overlay */}
                            <motion.div 
                              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                              onClick={handleExploreAllGames}
                              whileHover={{ scale: 1.02 }}
                            >
                              <motion.div 
                                className="flex flex-col items-center"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: [0.9, 1, 0.9] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <motion.div 
                                  className="w-14 h-14 rounded-full bg-purple-600/90 flex items-center justify-center"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                  </svg>
                                </motion.div>
                                <p className="text-white font-bold mt-2">Explore Games</p>
                              </motion.div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    {/* Floating Elements */}
                    <motion.div
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-6 -left-6 w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
                    >
                      <Gamepad2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [10, -10, 10] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -bottom-6 -right-6 w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
                    >
                      <Sparkles className="h-8 w-8 text-pink-500 dark:text-pink-400" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Games Section */}
          <section id="games-section" className="py-16 bg-white dark:bg-gray-800">
            {/* Categories container - wider than the main content */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-purple-100 dark:bg-purple-900/30 backdrop-blur-md border border-purple-200 dark:border-purple-700/50 shadow-md">
                  <Gamepad2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-600 dark:from-purple-400 dark:via-indigo-300 dark:to-pink-400 drop-shadow-sm">
                    Interactive Games Collection
                  </span>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-white/30"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </h2>
                
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-8 font-medium">
                  Browse our carefully selected games designed to promote relaxation and mindfulness. Find your perfect activity to unwind.
                </p>
              </div>

              {/* Category Filters - Single row layout with wider container */}
              <div className="mb-8 w-full max-w-screen-2xl mx-auto overflow-x-auto scrollbar-hide">
                <div className="flex flex-wrap justify-center mx-auto px-2 sm:px-4 md:px-6 lg:px-8 gap-2 sm:gap-3">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      variant={activeCategory === category ? "default" : "outline"}
                      className={`capitalize text-sm sm:text-base font-medium px-4 py-1.5 h-auto whitespace-nowrap transition-all duration-300 mb-2 ${
                        activeCategory === category
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white scale-105 shadow-md"
                          : "border-purple-300 text-gray-700 dark:text-gray-300 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      }`}
                    >
                      {formatCategory(category)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Games Grid - Exact YouTube-style responsive grid */}
              <motion.div 
                layout
                className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-6 mx-auto w-[97%] sm:w-[96%] lg:w-[95%] xl:w-[94%]"
              >
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, duration: 0.4 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="game-card-3d perspective-1000 w-full h-full"
                  >
                    <div className="transform-3d game-card rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 h-full relative shimmer-card">
                      <div className="relative aspect-video overflow-hidden group">
                        <Image
                          src={game.image}
                          alt={game.name}
                          width={640}
                          height={360}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Shimmer overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 shine-effect"></div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                          <Button
                            onClick={() => handlePlayGame(game.id)}
                            className="play-button flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-1 text-sm rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20 relative overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center">
                              <Play className="h-4 w-4 mr-1" />
                              Play
                            </span>
                            <motion.span 
                              className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                              initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                          </Button>
                        </div>
                        
                        {/* Category badge */}
                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-purple-600/90 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm capitalize shadow-lg">
                            {game.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-2 sm:p-3">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 truncate">
                          {game.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 h-8 overflow-hidden">
                          {game.description}
                        </p>
                        <Button
                          onClick={() => handlePlayGame(game.id)}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white relative overflow-hidden group text-xs sm:text-sm h-8"
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            <Play className="h-3 w-3 mr-1 transition-transform duration-300 group-hover:scale-125" />
                            Play Now
                          </span>
                          <motion.span 
                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                          />
                        </Button>
                      </div>
                      
                      {/* Border glow effect on hover */}
                      <div className="absolute inset-0 rounded-xl border-2 border-purple-500/0 group-hover:border-purple-500/50 transition-all duration-300 pointer-events-none"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
