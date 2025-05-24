import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const ScoreContainer = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 1rem auto;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    margin: 0.8rem auto;
  }
`;

const PlayerScore = styled(motion.div)`
  flex: 1;
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  background: ${props => props.isActive ? 'rgba(52, 152, 219, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.isActive ? 'rgba(52, 152, 219, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const PlayerName = styled.div`
  font-size: 1.2rem;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Score = styled.div`
  font-size: 2rem;
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ScoreBoard = ({ player1Score, player2Score, currentPlayer }) => {
  return (
    <ScoreContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PlayerScore
        isActive={currentPlayer === 1}
        animate={{
          scale: currentPlayer === 1 ? 1.05 : 1,
          backgroundColor: currentPlayer === 1 ? 'rgba(52, 152, 219, 0.2)' : 'transparent'
        }}
        transition={{ duration: 0.3 }}
      >
        <PlayerName>Player 1</PlayerName>
        <Score>{player1Score}</Score>
      </PlayerScore>
      <PlayerScore
        isActive={currentPlayer === 2}
        animate={{
          scale: currentPlayer === 2 ? 1.05 : 1,
          backgroundColor: currentPlayer === 2 ? 'rgba(52, 152, 219, 0.2)' : 'transparent'
        }}
        transition={{ duration: 0.3 }}
      >
        <PlayerName>Player 2</PlayerName>
        <Score>{player2Score}</Score>
      </PlayerScore>
    </ScoreContainer>
  );
};

export default ScoreBoard; 