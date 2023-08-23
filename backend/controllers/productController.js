import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

//@desc Fetch ALl products
const getProducts = asyncHandler(async (request, response) => {
  const products = await Product.find({});
  response.json(products);
});

//@desc Fetch ONE product
const getProductById = asyncHandler(async (request, response) => {
  const product = await Product.findById(request.params.id);

  if (product) response.json(product);
  else {
    response.status(404);
    throw new Error('Product Not Found');
  }
});

export { getProductById, getProducts };
