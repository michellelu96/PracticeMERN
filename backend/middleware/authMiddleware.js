import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// user needs to be authenticated
const protect = asyncHandler(async (request, response, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = request.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      request.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      response.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    response.status(401);
    throw new Error('Not authorized, no token');
  }
});

//user needs to be admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
