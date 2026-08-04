const Auth = (req, res, next) => {
  const token = "DUMMY_TOKEN";
  const isAdminAuthorized = token === "DUMMY_TOKEN";
  if (!isAdminAuthorized) {
    res.status(500).send("Unauthorized Entry!...");
  } else {
    next();
  }
};

module.exports = {
  authMiddleware: Auth,
};
