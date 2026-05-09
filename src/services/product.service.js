import sequelize from "../config/db.configration.js";
import { Product } from "../models/Product.model.js";
import {
  bulkInsertProducts,
  getAllProducts,
} from "../repositories/product.repository.js";
import { productSchema } from "../validations/product.validation.js";
import { Op, fn, col, literal } from "sequelize";

const normalizeData = (data) => {
  return data.map((item) => ({
    product_id: item.product_id,
    product_name: item.product_name,
    category: item.category,
    discounted_price: Number(item.discounted_price) || null,
    actual_price: Number(item.actual_price) || null,
    discount_percentage: Number(item.discount_percentage) || null,
    rating: Number(item.rating) || null,
    rating_count: Number(item.rating_count) || null,
    about_product: item.about_product,
    user_name: item.user_name,
    review_title: item.review_title,
    review_content: item.review_content,
  }));
};

const validateProducts = (data) => {
  return data.map((item) => {
    const { error, value } = productSchema.validate(item);
    if (error) throw new Error(error.message);
    return value;
  });
};

export const importProductDataa = async (data) => {
  const normalized = normalizeData(data);
  const validated = validateProducts(normalized);

  const transaction = await sequelize.transaction();

  try {
    await bulkInsertProducts(validated, transaction);
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
//=========================================
const CHUNK_SIZE = 500; 

export const importProductData = async (data) => {
  const normalized = normalizeData(data);

  const transaction = await sequelize.transaction();

  try {

    const chunks = chunkArray(normalized, CHUNK_SIZE);

    let totalInserted = 0;


    for (const chunk of chunks) {
  
      const validatedChunk = await validateProducts(chunk);

    
      await bulkInsertProducts(validatedChunk, transaction);

      totalInserted += validatedChunk.length;
    }

  
    await transaction.commit();

    return {
      inserted: totalInserted,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};



export const fetchProducts = async ({ page, limit }) => {
  const offset = (page - 1) * limit;

  const result = await getAllProducts({ limit, offset });

  return {
    total: result.count,
    rows: result.rows,
  };
};

export const getProductStats = async () => {
  const [totalProducts, aggregates, distinctCategories] = await Promise.all([
  
    Product.count(),

  
    Product.findOne({
      attributes: [
        [fn("SUM", col("rating_count")), "totalReviews"],
        [fn("AVG", col("rating")), "averageRating"],
        [fn("AVG", col("discount_percentage")), "avgDiscount"],
      ],
      raw: true,
    }),


    Product.findAll({
      attributes: [
        [
          fn("DISTINCT", literal("SPLIT_PART(category, '|', 1)")),
          "topCategory",
        ],
      ],
      raw: true,
    }),
  ]);

  return {
    totalProducts,
    totalReviews: parseInt(aggregates?.totalReviews || 0),
    averageRating: parseFloat((aggregates?.averageRating || 0).toFixed(2)),
    avgDiscount: Math.round((aggregates?.avgDiscount || 0) * 100), 
    categoriesCount: distinctCategories.length,
  };
};
