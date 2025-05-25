export const EMOJI_CATEGORIES = {
  Animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  Food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒'],
  Sports: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓'],
  Nature: ['🌸', '🌺', '🌹', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴'],
  Weather: ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️'],
  Space: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌍', '🌎', '🌏', '🌐', '🌠', '⭐', '✨'],
  Faces: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍'],
  Objects: ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️'],
  Music: ['🎵', '🎶', '🎼', '🎹', '🎸', '🎺', '🎻', '🎷', '🎤', '🎧', '🎼', '🎹', '🎸', '🎺', '🎻'],
  Travel: ['✈️', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛵']
};

export const WINNING_COMBINATIONS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6]  // diagonal top-right to bottom-left
];

export const MAX_EMOJIS_PER_PLAYER = 5;
export const BOARD_SIZE = 9; // 3x3 grid 