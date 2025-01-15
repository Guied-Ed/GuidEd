import mongoose, { ObjectId } from "mongoose";
import { CustomRequest } from "../middleware/verifyToken";
import Cart from "../models/cartSchema";
import Course from "../models/courseSchema";
import User from "../models/userSchema";
import { Response } from "express";

const getCartByUserId = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const totalPrice = cart.courses.reduce(
      (total, courseInCart) =>
        total + courseInCart.price * courseInCart.quantity,
      0
    );

    // You can update the cart's totalPrice if necessary
    cart.totalPrice = parseInt(totalPrice.toFixed(2));
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch cart" });
  }
};

const addCourseToCart = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    const { courseId } = req.params; // Extract courseId from the route parameters

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Check if a cart exists for the user
    let cart = await Cart.findOne({ userId });

    // If no cart exists, create a new cart
    if (!cart) {
      const newCart = new Cart({
        userId,
        courses: [],
      });

      // Add the course to the new cart
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      newCart.courses.push({
        courseId: course.id,
        courseName: course.tittle,
        price: course.price,
        quantity: 1,
      });

      // Save the new cart
      cart = await newCart.save();

      return res.status(201).json({
        success: true,
        message: "Cart created and course added",
        data: cart,
      });
    }

    // If cart exists, add or update the course in the cart
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingCourse = cart.courses.find(
      (courseInCart) => courseInCart.courseId.toString() === courseId
    );

    if (existingCourse) {
      // Update the existing course quantity to 1
      existingCourse.quantity = 1;
    } else {
      // Add new course to the cart with quantity set to 1
      cart.courses.push({
        courseId: course.id,
        courseName: course.tittle,
        price: course.price,
        quantity: 1,
      });
    }

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Course added to cart",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
};

const removeCourseFromCart = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const courseIndex = cart.courses.findIndex(
      (courseInCart) => courseInCart.courseId.toString() === courseId
    );

    if (courseIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found in cart" });
    }

    cart.courses.splice(courseIndex, 1);

    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove course from cart" });
  }
};

export { getCartByUserId, addCourseToCart, removeCourseFromCart };
