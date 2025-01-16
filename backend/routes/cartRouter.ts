import express, { Router } from "express";
import verifyToken from "../middleware/verifyToken";
import {
  addCourseToCart,
  getCartByUserId,
  removeCourseFromCart,
} from "../controllers/cartController";
const router: Router = express.Router();

router.post("/add-to-cart/:courseId", verifyToken, addCourseToCart);
router.post("/remove-from-cart/:courseId", verifyToken, removeCourseFromCart);
router.get("/", verifyToken, getCartByUserId);

export default router;
