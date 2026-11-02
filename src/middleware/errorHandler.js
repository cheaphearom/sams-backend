module.exports = (err, req, res, next) => {
  console.error(err);
  // Postgres rejects bad values that MySQL used to accept: "abc" as an id, an invalid date, a number out of range
  const badInput = ['22P02', '22007', '22008', '22003'].includes(err.code);
  const status = err.status || (badInput ? 400 : 500);
  res.status(status).json({
    message: err.message || 'Internal server error'
  });
};
