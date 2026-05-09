import sequelize from "../config/db.configration.js";
import { Sequelize } from "sequelize";
import { Product } from "./Product.model.js";
import { UploadHistory } from "./UploadHistory.model.js";
let db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Product = Product;
db.UploadHistory = UploadHistory;

export default db;
