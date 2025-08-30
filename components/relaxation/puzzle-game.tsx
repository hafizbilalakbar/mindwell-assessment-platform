"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

type Tile = {
  id: number
  value: number
  position: number
}

export function PuzzleGame() {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [emptyPosition, setEmptyPosition] = useState(8) // Last position is empty
  const [moves, setMoves] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Create tiles 1-8 (9th is empty)
    const initialTiles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      value: i + 1,
      position: i,
    }))

    // Shuffle tiles (ensure it's solvable)
    const shuffledTiles = [...initialTiles]
    let currentEmptyPos = 8

    // Make 50 random valid moves to shuffle
    for (let i = 0; i < 50; i++) {
      const possibleMoves = getValidMoves(currentEmptyPos)
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

      // Find tile at the random position
      const tileToMove = shuffledTiles.find((t) => t.position === randomMove)
      if (tileToMove) {
        tileToMove.position = currentEmptyPos
        currentEmptyPos = randomMove
      }
    }

    setTiles(shuffledTiles)
    setEmptyPosition(currentEmptyPos)
    setMoves(0)
    setIsGameOver(false)
  }

  const getValidMoves = (emptyPos: number) => {
    const validMoves = []
    // Check up
    if (emptyPos >= 3) validMoves.push(emptyPos - 3)
    // Check down
    if (emptyPos < 6) validMoves.push(emptyPos + 3)
    // Check left (not on left edge)
    if (emptyPos % 3 !== 0) validMoves.push(emptyPos - 1)
    // Check right (not on right edge)
    if (emptyPos % 3 !== 2) validMoves.push(emptyPos + 1)

    return validMoves
  }

  const handleTileClick = (position: number) => {
    // Check if move is valid
    const validMoves = getValidMoves(emptyPosition)
    if (!validMoves.includes(position)) return

    // Move tile
    const updatedTiles = tiles.map((tile) => {
      if (tile.position === position) {
        return { ...tile, position: emptyPosition }
      }
      return tile
    })

    setTiles(updatedTiles)
    setEmptyPosition(position)
    setMoves(moves + 1)

    // Check if game is over (all tiles in correct position)
    const isComplete = updatedTiles.every((tile) => tile.value === tile.position + 1)
    if (isComplete) {
      setIsGameOver(true)
    }
  }

  // Get tile at a specific position
  const getTileAtPosition = (position: number) => {
    return tiles.find((tile) => tile.position === position)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4">
        <div>
          <p className="text-sm font-medium">Moves: {moves}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={initializeGame}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-md aspect-square">
        {Array.from({ length: 9 }, (_, i) => {
          const tile = getTileAtPosition(i)
          return (
            <motion.div
              key={i}
              className={`flex items-center justify-center rounded-lg ${
                i === emptyPosition ? "bg-transparent" : "bg-primary/20 border-2 border-primary cursor-pointer"
              }`}
              onClick={() => handleTileClick(i)}
              whileHover={i !== emptyPosition ? { scale: 1.05 } : {}}
              whileTap={i !== emptyPosition ? { scale: 0.95 } : {}}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {tile && <span className="text-2xl font-bold">{tile.value}</span>}
            </motion.div>
          )
        })}
      </div>

      {isGameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-accent rounded-lg text-center"
        >
          <h3 className="text-lg font-bold mb-2">Congratulations!</h3>
          <p>You solved the puzzle in {moves} moves.</p>
          <Button className="mt-4" onClick={initializeGame}>
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  )
}
