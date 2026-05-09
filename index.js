import express from "express";
import cors from "cors";
import db from "./src/models/index.model.js";
import dotenv from "dotenv";
import productRoutes from "./src/routes/product.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/product", productRoutes);

app.use(errorHandler);

const port = process.env.PORT || 7000;

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("error while connecting db", error);
  });
