import express from "express";
import { upload } from "../middlewares/upload.js";

import {
  clearProducts,
  fetchProductStats,
  getProducts,
  getUploadHistory,
  uploadProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/stats", fetchProductStats);

router.post("/upload", upload.single("file"), uploadProducts);
router.get("/", getProducts);
router.get("/clear", clearProducts);
router.get("/upload-history", getUploadHistory);

export default router;
