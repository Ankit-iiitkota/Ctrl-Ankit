import fs from 'fs';
import path from 'path';

const filesToCopy = [
  {
    src: 'C:\\Users\\harry\\.gemini\\antigravity\\brain\\0ae72b7c-be1c-4b23-b0a4-67d24a07b453\\quickgist_extension_1781636253719.png',
    dest: 'c:\\Users\\harry\\OneDrive\\Desktop\\Portfolio\\public\\quick_gist.png'
  },
  {
    src: 'C:\\Users\\harry\\.gemini\\antigravity\\brain\\0ae72b7c-be1c-4b23-b0a4-67d24a07b453\\media__1781635341830.png',
    dest: 'c:\\Users\\harry\\OneDrive\\Desktop\\Portfolio\\public\\finora.png'
  },
  {
    src: 'C:\\Users\\harry\\.gemini\\antigravity\\brain\\0ae72b7c-be1c-4b23-b0a4-67d24a07b453\\media__1781635381047.png',
    dest: 'c:\\Users\\harry\\OneDrive\\Desktop\\Portfolio\\public\\brandforage_ai.png'
  },
  {
    src: 'C:\\Users\\harry\\.gemini\\antigravity\\brain\\0ae72b7c-be1c-4b23-b0a4-67d24a07b453\\media__1781635512832.png',
    dest: 'c:\\Users\\harry\\OneDrive\\Desktop\\Portfolio\\public\\blinkboard.png'
  }
];

filesToCopy.forEach(({ src, dest }) => {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Successfully copied ${src} to ${dest}`);
    } else {
      console.error(`Source file does not exist: ${src}`);
    }
  } catch (err) {
    console.error(`Error copying ${src} to ${dest}:`, err);
  }
});
