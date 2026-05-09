import { DataTypes } from "sequelize";
import sequelize from "../config/db.configration.js";

export const UploadHistory = sequelize.define(
  "UploadHistory",
  {
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fileType: {
      type: DataTypes.ENUM("csv", "excel"),
      allowNull: false,
    },

    totalRecords: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("success", "error", "pending"),
      defaultValue: "pending",
    },

    errorMessage: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
  },
  {
    tableName: "upload_histories",
    timestamps: true,
  },
);
