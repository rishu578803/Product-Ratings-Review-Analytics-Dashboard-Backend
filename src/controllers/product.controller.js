import { parseCSV, parseExcel } from "../utils/fileParser.js";
import {
  importProductData,
  fetchProducts,
  getProductStats,
} from "../services/product.service.js";
import { Product } from "../models/Product.model.js";
import { UploadHistory } from "../models/UploadHistory.model.js";

export const uploadProducts = async (req, res, next) => {
  let historyEntry = null;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File is required" });
    }

    const isCSV = req.file.mimetype.includes("csv");
    const isExcel =
      req.file.mimetype.includes("sheet") ||
      req.file.mimetype.includes("excel");

    if (!isCSV && !isExcel) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format. Upload CSV or Excel",
      });
    }

    historyEntry = await UploadHistory.create({
      fileName: req.file.originalname,
      fileType: isCSV ? "csv" : "excel",
      totalRecords: 0,
      status: "pending",
    });

    let data;
    if (isCSV) {
      data = await parseCSV(req.file.buffer);
    } else {
      data = parseExcel(req.file.buffer);
    }

    if (!data || data.length === 0) {
      await historyEntry.update({
        status: "error",
        errorMessage: "File is empty or invalid",
      });
      return res
        .status(400)
        .json({ success: false, message: "File is empty or invalid" });
    }

    console.log("Parsed rows:", data.length);

    await importProductData(data);

    await historyEntry.update({
      status: "success",
      totalRecords: data.length,
    });

    return res.status(200).json({
      success: true,
      message: "Data imported successfully",
      totalRecords: data.length,
    });
  } catch (error) {
    if (historyEntry) {
      await historyEntry
        .update({
          status: "error",
          errorMessage: error.message,
        })
        .catch(() => {});
    }
    next(error);
  }
};

export const getUploadHistory = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const offset = (page - 1) * limit;

    const { count: total, rows } = await UploadHistory.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      pagination: {
        totalRecords: total,
        currentPage: page,
        totalPages,
        limit,
      },
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
export const getProducts = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      category,
      rating_min,
      rating_max,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const filters = {
      ...(search && { search: search.trim() }),
      ...(category && { category: category.trim() }),
      ...(rating_min && { ratingMin: parseFloat(rating_min) }),
      ...(rating_max && { ratingMax: parseFloat(rating_max) }),
    };

    const { total, rows } = await fetchProducts({ page, limit, filters });

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      pagination: {
        totalRecords: total,
        currentPage: page,
        totalPages,
        limit,
      },
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

export const clearProducts = async (req, res, next) => {
  try {
    const deletedCount = await Product.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    return res.status(200).json({
      success: true,
      message: "All products deleted successfully",
      deletedRecords: deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchProductStats = async (req, res, next) => {
  try {
    const stats = await getProductStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
