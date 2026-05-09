import Joi from "joi";

export const productSchema = Joi.object({
  product_id: Joi.string().required(),
  product_name: Joi.string().allow(""),
  category: Joi.string().allow(""),
  discounted_price: Joi.number().allow(null),
  actual_price: Joi.number().allow(null),
  discount_percentage: Joi.number().allow(null),
  rating: Joi.number().allow(null),
  rating_count: Joi.number().allow(null),
  about_product: Joi.string().allow(""),
  user_name: Joi.string().allow(""),
  review_title: Joi.string().allow(""),
  review_content: Joi.string().allow(""),
});
