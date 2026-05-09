import { DataTypes } from "sequelize";
import sequelize from "../config/db.configration.js";

export const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    product_name: {
      type: DataTypes.TEXT,
    },

    category: {
      type: DataTypes.TEXT,
    },

    discounted_price: {
      type: DataTypes.FLOAT,
    },

    actual_price: {
      type: DataTypes.FLOAT,
    },

    discount_percentage: {
      type: DataTypes.FLOAT,
    },

    rating: {
      type: DataTypes.FLOAT,
    },

    rating_count: {
      type: DataTypes.INTEGER,
    },

    about_product: {
      type: DataTypes.TEXT,
    },

    user_name: {
      type: DataTypes.TEXT,
    },

    review_title: {
      type: DataTypes.TEXT,
    },

    review_content: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  },
);
