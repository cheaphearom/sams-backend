const bcrypt = require('bcryptjs');

(async () => {
  const plain = '1234';  // change password here if needed
  const hash = await bcrypt.hash(plain, 10);
  console.log('Plain password:', plain);
  console.log('Generated hash:', hash);
})();
