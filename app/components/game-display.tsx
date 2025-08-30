"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface GameData {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  category?: string;
  featured?: boolean;
}

interface GameDisplayProps {
  gameData: GameData;
  onClose: () => void;
  getSandboxPermissions?: () => string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function GameDisplay({
  gameData,
  onClose,
  getSandboxPermissions = () => "allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-presentation allow-modals allow-orientation-lock allow-popups-to-escape-sandbox",
  onLoad = () => {},
  onError = () => {},
}: GameDisplayProps) {
  if (!gameData) return null;

  // Prevent body scrolling when game is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-[1400px] game-content flex items-center justify-center">
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[10000] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 active:scale-95" 
          onClick={onClose}
          aria-label="Close game"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </motion.button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative overflow-hidden rounded-xl shadow-2xl border border-purple-500/20"
        >
          <iframe
            src={gameData.link}
            title={gameData.name}
            className="game-iframe"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={onLoad}
            onError={onError}
            sandbox={getSandboxPermissions()}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </motion.div>
  );
} 