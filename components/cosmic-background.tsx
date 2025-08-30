"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Engine } from "tsparticles-engine";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface CosmicBackgroundProps {
  className?: string;
}

export function CosmicBackground({ className = "" }: CosmicBackgroundProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const orbitRef = useRef<HTMLDivElement>(null);
  
  // Wait until mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (theme === "dark" || resolvedTheme === "dark");

  // Setup the particles 
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Create orbital animations
  useEffect(() => {
    if (!mounted || !orbitRef.current) return;
    
    const orbitContainer = orbitRef.current;
    const orbitElements = orbitContainer.querySelectorAll('.orbital-element');
    
    // Randomly position and animate each orbital element
    orbitElements.forEach((element, index) => {
      const orbitEl = element as HTMLElement;
      const delay = index * 0.2; // Stagger the animations
      const duration = 20 + Math.random() * 40; // Random duration between 20-60s
      const startAngle = Math.random() * 360; // Random start position
      
      // Set initial position
      orbitEl.style.transform = `rotate(${startAngle}deg) translateX(${50 + index * 10}px)`;
      
      // Start animation
      setTimeout(() => {
        orbitEl.style.transition = `transform ${duration}s linear infinite`;
        orbitEl.style.transform = `rotate(${startAngle + 360}deg) translateX(${50 + index * 10}px)`;
        
        // Set animation to repeat
        setInterval(() => {
          const currentAngle = startAngle + 360;
          orbitEl.style.transform = `rotate(${currentAngle + 360}deg) translateX(${50 + index * 10}px)`;
        }, duration * 1000);
      }, delay * 1000);
    });
  }, [mounted]);

  // Custom options with correct type structure for tsParticles
  const lightThemeOptions: any = {
    fullScreen: {
      enable: false,
    },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 30,
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 1200,
        },
      },
      color: {
        value: ["#ffcce6", "#ffe6f2", "#ffd1e8", "#dcd6f7", "#f4ddff", "#b5c0ff", "#e0c8ff", "#ffc8e7", "#f0e6ff", "#e6f0ff"],
      },
      shape: {
        type: ["circle", "edge", "polygon"],
        options: {
          edge: {
            sides: 5,
          },
          polygon: {
            sides: 6,
          },
        },
      },
      opacity: {
        value: {
          min: 0.03,
          max: 0.2,
        },
        animation: {
          enable: true,
          speed: 0.12,
          minimumValue: 0.02,
          sync: false,
        },
      },
      size: {
        value: {
          min: 80,
          max: 220,
        },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 60,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 0.12,
        direction: "none" as const,
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200,
        },
        trail: {
          enable: true,
          length: 4,
          fillColor: "#ffffff00",
        },
        path: {
          enable: true,
          delay: {
            value: 0.1
          }
        },
      },
      blur: {
        value: 15,
        enable: true,
      },
      rotate: {
        value: {
          min: 0,
          max: 360,
        },
        direction: "random",
        animation: {
          enable: true,
          speed: 0.4,
        },
      },
      links: {
        enable: true,
        distance: 350,
        color: "#ffffff",
        opacity: 0.02,
        width: 1,
        triangles: {
          enable: true,
          opacity: 0.015,
        },
      },
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: "bubble",
          parallax: {
            enable: true,
            force: 4,
            smooth: 20,
          },
        },
        onClick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        bubble: {
          distance: 250,
          size: 160,
          duration: 2,
          opacity: 0.3,
          speed: 2,
        },
        push: {
          quantity: 1,
          size: 180,
        },
      },
    },
    detectRetina: true,
  };

  // Use the same structure for dark theme options
  const darkThemeOptions: any = {
    ...lightThemeOptions,
    particles: {
      ...lightThemeOptions.particles,
      color: {
        value: ["#312e81", "#4338ca", "#5b21b6", "#6d28d9", "#7e22ce", "#3730a3", "#4f46e5", "#6d28d9", "#2e1065", "#4c1d95"],
      },
      opacity: {
        ...lightThemeOptions.particles.opacity,
        value: {
          min: 0.06,
          max: 0.25,
        },
      },
      blur: {
        ...lightThemeOptions.particles.blur,
        value: 18,
      },
      links: {
        ...lightThemeOptions.particles.links,
        color: "#6d28d9",
        opacity: 0.03,
      },
    },
    interactivity: {
      ...lightThemeOptions.interactivity,
      modes: {
        bubble: {
          distance: 250,
          size: 180,
          duration: 2,
          opacity: 0.6,
          speed: 2,
        },
        push: {
          quantity: 2,
          size: 200,
        },
      },
    },
  };

  if (!mounted) return null;

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Base gradients with more depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50/80 to-purple-50/50 dark:from-indigo-950 dark:via-purple-950/90 dark:to-gray-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(253,242,248,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(109,40,217,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(243,232,255,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(67,56,202,0.15),transparent_70%)]"></div>
      
      {/* Grain texture overlay for modern feel */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      
      {/* tsParticles floating orbs */}
      <Particles
        id="tsparticles-cosmic"
        init={particlesInit}
        options={isDarkMode ? darkThemeOptions : lightThemeOptions}
        className="absolute inset-0"
      />
      
      {/* Create floating orbital system */}
      <div ref={orbitRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Central star/core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-radial from-purple-400/30 to-indigo-600/10 dark:from-purple-500/30 dark:to-indigo-700/10 blur-xl animate-pulse-slow"></div>
        
        {/* Orbital paths - subtle rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-purple-300/10 dark:border-purple-700/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-indigo-300/5 dark:border-indigo-700/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-pink-300/5 dark:border-pink-700/5"></div>
        
        {/* Orbital elements - these will be animated via JS */}
        <div className="orbital-element absolute top-1/2 left-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-400/40 dark:bg-purple-600/40 blur-sm"></div>
        <div className="orbital-element absolute top-1/2 left-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-400/30 dark:bg-indigo-600/30 blur-sm"></div>
        <div className="orbital-element absolute top-1/2 left-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-sm"></div>
        <div className="orbital-element absolute top-1/2 left-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-pink-400/30 dark:bg-pink-600/30 blur-sm"></div>
        
        {/* Animated floating elements using Framer Motion */}
        <motion.div 
          className="absolute top-[20%] left-[15%] w-40 h-40 rounded-full bg-gradient-to-br from-purple-400/10 to-indigo-500/5 dark:from-purple-600/10 dark:to-indigo-700/5 blur-2xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-[30%] right-[20%] w-60 h-60 rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-500/5 dark:from-indigo-600/10 dark:to-purple-700/5 blur-2xl"
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Shooting stars */}
        <motion.div 
          className="absolute h-0.5 w-20 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          style={{ top: '10%', left: '30%', rotate: '30deg' }}
          animate={{
            opacity: [0, 0.8, 0],
            x: [0, 300],
            y: [0, 200],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 15,
            ease: "easeOut"
          }}
        />
        
        <motion.div 
          className="absolute h-0.5 w-30 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          style={{ top: '20%', right: '20%', rotate: '-40deg' }}
          animate={{
            opacity: [0, 0.8, 0],
            x: [-300, 0],
            y: [0, 200],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 23,
            ease: "easeOut"
          }}
        />
      </div>
      
      {/* Nebula-like effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[10%] left-[60%] w-[500px] h-[300px] rotate-[-30deg] opacity-[0.07] bg-gradient-radial from-purple-300 via-transparent to-transparent dark:from-purple-600 dark:via-transparent dark:to-transparent blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[250px] rotate-[15deg] opacity-[0.05] bg-gradient-radial from-indigo-300 via-transparent to-transparent dark:from-indigo-600 dark:via-transparent dark:to-transparent blur-3xl"></div>
      </div>
      
      {/* Interactive stars - tiny dots that twinkle */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white dark:bg-purple-200"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.6,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
} 