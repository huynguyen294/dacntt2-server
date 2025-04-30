const roles =
  (listRole = []) =>
  (req, res, next) => {
    req.roles = listRole;
    const userRole = req.userRole;
    if (listRole.includes(userRole)) return next();
    return res.status(403).json({ message: "Truy cập bị từ chối!" });
  };

export default roles;
