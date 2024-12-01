'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { WalletSelector } from "@/components/WalletSelector"
import { useWallet } from '@aptos-labs/wallet-adapter-react'

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)
  const [gameRunning, setGameRunning] = useState(false)
  const { account } = useWallet()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gridSize = 20
    let snake = [{ x: 200, y: 200 }]
    let food = { x: 100, y: 100 }
    let direction = { x: 0, y: 0 }
    let gameLoop: number | null = null

    const drawRect = (x: number, y: number, color: string) => {
      ctx.shadowBlur = 15
      ctx.shadowColor = color
      ctx.fillStyle = color
      ctx.fillRect(x, y, gridSize - 2, gridSize - 2)
    }

    const placeFood = () => {
      food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
      }
    }

    const checkCollision = (head: { x: number; y: number }) => {
      if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
      ) {
        return true
      }
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          return true
        }
      }
      return false
    }

    const gameStep = () => {
      if (gameOver || !gameRunning) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Move snake
      const newHead = {
        x: snake[0].x + direction.x * gridSize,
        y: snake[0].y + direction.y * gridSize
      }

      if (checkCollision(newHead)) {
        setGameOver(true)
        setGameRunning(false)
        return
      }

      snake.unshift(newHead)

      // Check if snake ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prevScore) => prevScore + 1)
        placeFood()
      } else {
        snake.pop()
      }

      // Draw food
      drawRect(food.x, food.y, "#ff00ff")

      // Draw snake
      snake.forEach((segment) => drawRect(segment.x, segment.y, "#00ffcc"))
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (!gameRunning) return

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) direction = { x: 0, y: -1 }
          break
        case 'ArrowDown':
          if (direction.y === 0) direction = { x: 0, y: 1 }
          break
        case 'ArrowLeft':
          if (direction.x === 0) direction = { x: -1, y: 0 }
          break
        case 'ArrowRight':
          if (direction.x === 0) direction = { x: 1, y: 0 }
          break
      }
    }

    const startGame = () => {
      snake = [{ x: 200, y: 200 }]
      direction = { x: 1, y: 0 }
      setScore(0)
      setGameOver(false)
      setGameRunning(true)
      placeFood()
      if (gameLoop) clearInterval(gameLoop)
      gameLoop = window.setInterval(gameStep, 100)
    }

    window.addEventListener('keydown', handleKeydown)

    if (gameRunning && !gameOver) {
      startGame()
    }

    return () => {
      if (gameLoop) clearInterval(gameLoop)
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [gameOver, gameRunning])

  const handleStartRestart = () => {
    setGameRunning(true)
    setGameOver(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="absolute top-4 right-4">
        <WalletSelector />
      </div>
      <h1 className="mb-4 font-mono text-4xl font-bold text-transparent"
          style={{
            textShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc',
            color: '#00ffcc'
          }}>
        Snake Neon Retro
      </h1>
      <div className="mb-4 font-mono text-xl text-[#00ffcc]">Score: {score}</div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width="400"
          height="400"
          className="rounded border-4 border-[#00ffcc] shadow-[0_0_20px_#00ffcc]"
        />
      </div>
      {account ? (
        <Button
          onClick={handleStartRestart}
          className="mt-4 bg-[#00ffcc] font-mono text-black hover:bg-[#00ffcc]/90"
        >
          {gameOver ? 'Restart Game' : gameRunning ? 'eat!' : 'Start Game'}
        </Button>
      ) : (
        <p className="mt-4 text-[#00ffcc] font-mono">Connect your Aptos wallet to play</p>
      )}
    </div>
  )
}

