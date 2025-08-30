"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

type Card = {
  id: number
  content: string
  isFlipped: boolean
  isMatched: boolean
}

const emojis = ["🌟", "🌈", "🌺", "🌴", "🌊", "🍎", "🍋", "🍉"]

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Create pairs of cards with emojis
    const cardPairs = [...emojis, ...emojis].map((content, index) => ({
      id: index,
      content,
      isFlipped: false,
      isMatched: false,
    }))

    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setIsGameOver(false)
  }

  const handleCardClick = (id: number) => {
    // Ignore if already flipped or matched
    if (cards[id].isFlipped || cards[id].isMatched || flippedCards.length >= 2) {
      return
    }

    // Flip the card
    const updatedCards = [...cards]
    updatedCards[id].isFlipped = true
    setCards(updatedCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id]
    setFlippedCards(newFlippedCards)

    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)

      const [firstId, secondId] = newFlippedCards
      if (cards[firstId].content === cards[secondId].content) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[firstId].isMatched = true
          matchedCards[secondId].isMatched = true
          setCards(matchedCards)
          setFlippedCards([])
          setMatches(matches + 1)

          // Check if game is over
          if (matches + 1 === emojis.length) {
            setIsGameOver(true)
          }
        }, 500)
      } else {
        // No match, flip back
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[firstId].isFlipped = false
          resetCards[secondId].isFlipped = false
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4">
        <div>
          <p className="text-sm font-medium">Moves: {moves}</p>
        </div>
        <div>
          <p className="text-sm font-medium">
            Matches: {matches}/{emojis.length}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={initializeGame}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-md">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer text-2xl ${
              card.isFlipped || card.isMatched ? "bg-primary/20 border-2 border-primary" : "bg-secondary"
            }`}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {(card.isFlipped || card.isMatched) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                {card.content}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {isGameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-accent rounded-lg text-center"
        >
          <h3 className="text-lg font-bold mb-2">Congratulations!</h3>
          <p>You completed the game in {moves} moves.</p>
          <Button className="mt-4" onClick={initializeGame}>
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  )
}
