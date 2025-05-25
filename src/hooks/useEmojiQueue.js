import { useState, useCallback } from 'react';

export const useEmojiQueue = (maxSize = 5) => {
  const [queue, setQueue] = useState([]);
  const [vanishedCell, setVanishedCell] = useState(null);

  const addEmoji = useCallback((emoji, cellIndex) => {
    let vanishedCellIndex = null;
    
    setQueue(prevQueue => {
      // Check if we need to remove the oldest emoji
      if (prevQueue.length >= maxSize) {
        const oldestEmoji = prevQueue[0];
        vanishedCellIndex = oldestEmoji.cellIndex;
        // Remove the oldest emoji and add the new one
        return [...prevQueue.slice(1), { emoji, cellIndex }];
      }
      // Just add the new emoji if we haven't reached maxSize
      return [...prevQueue, { emoji, cellIndex }];
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