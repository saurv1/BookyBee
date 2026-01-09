const restrictTo = (...roles)=>{
  return (req, res, next)=>{
    //  console.log(roles)

    const userRole= req.user.role

    if(!roles.includes(userRole)){
        res.status(403).json({
            message:"you have not access to create uset this resource"
        })
    }
    else(
        next()
    )
  }
}

module.exports= restrictTo