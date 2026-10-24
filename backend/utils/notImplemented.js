// Placeholder handler for routes that were declared but never implemented.
// Returns a clean 501 instead of crashing the server at startup.
module.exports = (label) => (req, res) =>
  res.status(501).json({ success: false, message: `${label} is not implemented yet` });
