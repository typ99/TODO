const crypto = require('crypto');

const getPostData = (req) => new Promise((resolve, reject) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
  } catch (err) {
    reject(err);
  }
});

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

const generateToken = (length) => {
  const a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
  const b = [];
  for (let i = 0; i < length; i += 1) {
    const j = (Math.floor(Math.random() * (a.length - 1)));
    b.push(a[j]);
  }
  return b.join('');
};

module.exports = {
  getPostData,
  hashPassword,
  generateToken,
};
