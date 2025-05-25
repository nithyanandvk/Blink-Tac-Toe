import { useState, useCallback } from 'react';

export const useEmojiQueue = (maxSize = 5) => {
  const [queue, setQueue] = useState([]);
  const [vanishedCell, setVanishedCell] = useState(null);

  const addEmoji = useCallback((emoji, cellIndex) => {
    let vanishedCellIndex = null;
    setQueue(prevQueue => {
      const newQueue = [...prevQueue, { emoji, cellIndex }];
      if (newQueue.length > maxSize) {
        const oldestEmoji = newQueue[0];
        vanishedCellIndex = oldestEmoji.cellIndex;
        return newQueue.slice(1);
      }
      return newQueue;
    });
    setVanishedCell(vanishedCellIndex);
    return { vanishedCell: vanishedCellIndex };
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