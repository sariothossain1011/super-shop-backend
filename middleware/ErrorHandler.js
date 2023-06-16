function ErrorHandler(error, req, res, next) {
  if (error.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(500).json({ message: "The user have no authorized" });
  }
  if (error.name === "ValidationError") {
    // validation error
    return res.status(500).json({ message: error });
  }
  // default to 500 server error
  return res.status(500).json(error);
}

module.exports = ErrorHandler;
