import { Product } from "../models/Product.model.js";

export const bulkInsertProducts = async (data, transaction) => {
  return await Product.bulkCreate(data, {
    transaction,
    validate: false,
    ignoreDuplicates: true,
  });
};

export const getAllProducts = async ({ limit, offset }) => {
  return await Product.findAndCountAll({
    limit,
    offset,
    order: [["id", "DESC"]],
  });
};
