import { useState, useCallback } from 'react';

export const useEmojiQueue = (maxSize = 5) => {
  const [queue, setQueue] = useState([]);
  const [vanishedCell, setVanishedCell] = useState(null);

  const addToQueue = useCallback((emoji) => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue, emoji];
      if (newQueue.length > maxSize) {
        setVanishedCell(newQueue[0]);
        return newQueue.slice(1);
      }
      return newQueue;
    });
  }, [maxSize]);

  const removeFromQueue = useCallback(() => {
    setQueue(prevQueue => prevQueue.slice(1));
  }, []);

  return { queue, addToQueue, removeFromQueue, vanishedCell };
}; 