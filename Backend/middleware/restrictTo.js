const restrictTo = (...roles) => {
  return (req, res, next) => {
    //  console.log(roles)

    const userRole = req.user.role

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "You do not have access to this resource"
      });
    }
    next();
  }
}

module.exports = restrictTo