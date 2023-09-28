import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken.js';

//@desc Auth User & get token
//@route POST /api/users/login
const authUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(response, user._id);
    response.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    response.status(401);
    throw new Error('Invalid Email or Password');
  }
});

//@desc Reg User & get token
//@route POST /api/users/
const registerUser = asyncHandler(async (request, response) => {
  const { name, email, password } = request.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    response.status(400);
    throw new Error('User Already Exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(response, user._id);

    response.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    response.status(400);
    throw new Error('Invalid User Data');
  }
});

//@desc Logout User & clear cookie
//@route POST /api/users/logout
const logoutUser = asyncHandler(async (request, response) => {
  response.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  response.status(200).json({ message: 'Logged out successfully' });
});

//@desc Get user Profile
//@route GET /api/users/profile
const getUserProfile = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user._id);

  if (user) {
    generateToken(response, user._id);

    response.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    response.status(404);
    throw new Error('User not found');
  }
});

//@desc UPDATE user Profile
//@route PUT /api/users/profile
const updateUserProfile = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user._id);

  if (user) {
    user.name = request.body.name || user.name;
    user.email = request.body.email || user.email;

    if (request.body.password) {
      user.password = request.body.password;
    }

    const updatedUser = await user.save();

    response.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    response.status(404);
    throw new Error('User not found');
  }
});

//@desc Get all user Profile
//@route GET /api/users/
// ADMIN ONLY
const getUsers = asyncHandler(async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

//@desc Get one user Profile
//@route GET /api/users/:id
// ADMIN ONLY
const getUserByID = asyncHandler(async (request, response) => {
  response.send('get by ID');
});

//@desc Update user
//@route GET /api/users/:id
// ADMIN ONLY
const updateUser = asyncHandler(async (request, response) => {
  response.send('update one user');
});

//@desc Delete User
//@route DELETE /api/users/:id
// ADMIN ONLY
const deleteUser = asyncHandler(async (request, response) => {
  response.send('Delete User');
});

export {
  authUser,
  getUserByID,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
  updateUser,
  getUsers,
  deleteUser,
};
