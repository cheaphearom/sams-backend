const bcrypt = require('bcryptjs');

const plain = 'password123'; // same as above
const hash = '$2a$10$GqhVcj2uWJrH75aR3A8rCehwBvWxWMxkbBrPSL1iEOr6WbknIbeem';

(async () => {
  const ok = await bcrypt.compare(plain, hash);
  console.log('Compare result:', ok);
})();
