import { useState, useCallback } from 'react';

export const useEmojiQueue = (maxSize) => {
  const [queue, setQueue] = useState([]);
  const [vanishedCell, setVanishedCell] = useState(null);

  const addEmoji = useCallback((emoji, cellIndex) => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue, { emoji, cellIndex }];
      if (newQueue.length > maxSize) {
        const oldestEmoji = newQueue[0];
        setVanishedCell(oldestEmoji.cellIndex);
        return newQueue.slice(1);
      }
      setVanishedCell(null);
      return newQueue;
    });
    return { vanishedCell };
  }, [maxSize]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setVanishedCell(null);
  }, []);

  return {
    queue,
    vanishedCell,
    addEmoji,
    clearQueue
  };
}; 