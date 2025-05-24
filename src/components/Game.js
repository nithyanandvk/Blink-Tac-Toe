import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { EMOJI_CATEGORIES, WINNING_COMBINATIONS, MAX_EMOJIS_PER_PLAYER } from '../constants';
import { useSound } from '../hooks/useSound';
import { useEmojiQueue } from '../hooks/useEmojiQueue';
import RulesModal from './RulesModal';
import ScoreBoard from './ScoreBoard';
import Confetti from 'react-confetti';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2c, #2d3a54, #3498db);
  color: white;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Title = styled(motion.h1)`
  color: white;
  margin-bottom: 1rem;
  text-align: center;
  font-size: clamp(2rem, 8vw, 4.5rem);
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to right, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
`;

const Board = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;
  perspective: 1000px;
  width: min(400px, 95vw);
  margin: 1rem auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 480px) {
    gap: 6px;
    padding: 8px;
  }
`;

const Cell = styled(motion.div)`
  aspect-ratio: 1;
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.5rem, 4vw, 3rem);
  cursor: pointer;
  user-select: none;
  position: relative;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const EmojiWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const EmojiBackground = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${props => props.player === 1 ? 'rgba(52, 152, 219, 0.3)' : 'rgba(231, 76, 60, 0.3)'};
  border-radius: 20px;
  z-index: 0;
  backdrop-filter: blur(5px);
`;

const EmojiContent = styled(motion.div)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const PlayerIndicator = styled(motion.div)`
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
  background: ${props => props.player === 1 ? '#3498db' : '#e74c3c'};
  padding: 6px 16px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Status = styled(motion.div)`
  margin: 0.8rem 0;
  font-size: clamp(1.2rem, 4vw, 2.2rem);
  color: white;
  text-align: center;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Button = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  font-size: clamp(1rem, 3vw, 1.3rem);
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin: 0.8rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-weight: bold;
  letter-spacing: 1px;
  
  &:hover {
    background: linear-gradient(135deg, #2980b9, #3498db);
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #bdc3c7, #95a5a6);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CategorySelection = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.8rem;
    padding: 0.5rem;
  }
`;

const CategorySection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const CategoryTitle = styled.h3`
  color: white;
  margin-bottom: 0.8rem;
  font-size: clamp(1.2rem, 3vw, 2rem);
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 600;
`;

const CategoryButton = styled(motion.button)`
  padding: 0.8rem;
  font-size: clamp(0.9rem, 2.5vw, 1.3rem);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  cursor: pointer;
  margin: 0.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 5px 10px rgba(0, 0, 0, 0.2)'};
    border: ${props => props.disabled ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid rgba(255, 255, 255, 0.5)'};
  }
`;

const CategoryPreview = styled.div`
  display: flex;
  gap: 0.3rem;
  font-size: clamp(0.9rem, 2.5vw, 1.3rem);
  flex-wrap: wrap;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin: 1rem 0;
  font-size: 1.1rem;
  text-align: center;
  background: rgba(255, 107, 107, 0.1);
  padding: 1rem 2rem;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 107, 107, 0.2);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
  }
`;

const HelpButton = styled(motion.button)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
`;

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Category, setPlayer1Category] = useState(null);
  const [player2Category, setPlayer2Category] = useState(null);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [winningLine, setWinningLine] = useState(null);
  const [playerEmojis, setPlayerEmojis] = useState({ 1: [], 2: [] });
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const { playSound } = useSound();
  const player1Queue = useEmojiQueue(MAX_EMOJIS_PER_PLAYER);
  const player2Queue = useEmojiQueue(MAX_EMOJIS_PER_PLAYER);

  const getRandomEmoji = (category) => {
    const emojis = EMOJI_CATEGORIES[category];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const handleCategorySelect = (player, category) => {
    setError('');
    
    if (player === 1) {
      if (category === player2Category) {
        setError("Players can't select the same category!");
        return;
      }
      setPlayer1Category(category);
    } else {
      if (category === player1Category) {
        setError("Players can't select the same category!");
        return;
      }
      setPlayer2Category(category);
    }
    playSound('turn');
  };

  const startGame = () => {
    if (player1Category && player2Category && player1Category !== player2Category) {
      setGameStarted(true);
      playSound('turn');
    } else {
      setError("Please select different categories for both players!");
    }
  };

  const checkWinner = (board) => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        board[a]?.emoji && 
        board[b]?.emoji && 
        board[c]?.emoji &&
        board[a]?.player === board[b]?.player &&
        board[a]?.player === board[c]?.player &&
        board[a]?.player === currentPlayer
      ) {
        setWinningLine(combination);
        return board[a].player;
      }
    }
    return null;
  };

  const handleCellClick = (index) => {
    if (winner) {
      playSound('error');
      return;
    }

    if (board[index]) {
      playSound('error');
      return;
    }

    const currentCategory = currentPlayer === 1 ? player1Category : player2Category;
    const currentQueue = currentPlayer === 1 ? player1Queue : player2Queue;

    const newEmoji = getRandomEmoji(currentCategory);
    const newBoard = [...board];
    const { vanishedCell: newVanishedCell } = currentQueue.addEmoji(newEmoji, index);
    
    if (newVanishedCell !== null && newVanishedCell !== undefined) {
      newBoard[newVanishedCell] = null;
      playSound('vanish');
    }
    
    newBoard[index] = {
      emoji: newEmoji,
      player: currentPlayer,
      timestamp: Date.now()
    };
    
    setBoard(newBoard);
    playSound('place');

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(currentPlayer);
      setShowConfetti(true);
      playSound('win');
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + 1);
      } else {
        setPlayer2Score(prev => prev + 1);
      }
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      playSound('turn');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setWinner(null);
    setWinningLine(null);
    player1Queue.clearQueue();
    player2Queue.clearQueue();
    setGameStarted(false);
    setPlayer1Category(null);
    setPlayer2Category(null);
    setError('');
    setShowConfetti(false);
    playSound('turn');
  };

  if (!gameStarted) {
    return (
      <GameContainer>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Blink Tac Toe
        </Title>
        <Status>Select Emoji Categories</Status>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <CategorySelection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <CategorySection
              key={category}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryTitle>{category}</CategoryTitle>
              <CategoryButton
                onClick={() => handleCategorySelect(1, category)}
                style={{
                  background: player1Category === category ? '#3498db' : 'white',
                  color: player1Category === category ? 'white' : 'black'
                }}
                disabled={category === player2Category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Player 1</span>
                <CategoryPreview>
                  {emojis.slice(0, 3).map((emoji, index) => (
                    <span key={index}>{emoji}</span>
                  ))}
                </CategoryPreview>
              </CategoryButton>
              <CategoryButton
                onClick={() => handleCategorySelect(2, category)}
                style={{
                  background: player2Category === category ? '#3498db' : 'white',
                  color: player2Category === category ? 'white' : 'black'
                }}
                disabled={category === player1Category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Player 2</span>
                <CategoryPreview>
                  {emojis.slice(0, 3).map((emoji, index) => (
                    <span key={index}>{emoji}</span>
                  ))}
                </CategoryPreview>
              </CategoryButton>
            </CategorySection>
          ))}
        </CategorySelection>
        <Button
          onClick={startGame}
          disabled={!player1Category || !player2Category || player1Category === player2Category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Game
        </Button>
        <HelpButton
          onClick={() => {
            setShowRules(true);
            playSound('button');
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ?
        </HelpButton>
        <RulesModal isOpen={showRules} onClose={() => {
          setShowRules(false);
          playSound('button');
        }} />
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Blink Tac Toe
      </Title>
      <ScoreBoard
        player1Score={player1Score}
        player2Score={player2Score}
        currentPlayer={currentPlayer}
      />
      <Status
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {winner
          ? `🎉 Player ${winner} Wins!`
          : `Player ${currentPlayer}'s Turn`}
      </Status>
      <Board
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {board.map((cell, index) => (
          <Cell
            key={index}
            onClick={() => handleCellClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: winningLine?.includes(index) 
                ? 'rgba(52, 152, 219, 0.3)' 
                : 'rgba(255, 255, 255, 0.15)',
              transform: winningLine?.includes(index) ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {cell && (
              <EmojiWrapper
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <EmojiBackground player={cell.player} />
                <EmojiContent>
                  {cell.emoji}
                  <PlayerIndicator player={cell.player}>
                    P{cell.player}
                  </PlayerIndicator>
                </EmojiContent>
              </EmojiWrapper>
            )}
          </Cell>
        ))}
      </Board>
      <Button
        onClick={resetGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🔄 Play Again
      </Button>
      <HelpButton
        onClick={() => {
          setShowRules(true);
          playSound('button');
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ?
      </HelpButton>
      <RulesModal isOpen={showRules} onClose={() => {
        setShowRules(false);
        playSound('button');
      }} />
    </GameContainer>
  );
};

export default Game; 