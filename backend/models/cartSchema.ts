import mongoose, { Schema, Document, model } from "mongoose";

interface Course {
  courseId: mongoose.Types.ObjectId;
  courseName: string;
  price: number;
  quantity: number;
}

interface CartModel extends Document {
  userId: mongoose.Types.ObjectId;
  courses: Course[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema: Schema<CartModel> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: [true, "Course ID is required"],
        },
        courseName: {
          type: String,
          required: [true, "Course name is required"],
        },
        price: {
          type: Number,
          required: [true, "Course price is required"],
          min: [0, "Price cannot be negative"],
        },
        quantity: {
          type: Number,
          required: [true, "Course quantity is required"],
          min: [1, "Quantity cannot be less than 1"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  if (this.courses && this.courses.length > 0) {
    this.totalPrice = this.courses.reduce(
      (acc, course) => acc + course.price * course.quantity,
      0
    );
  } else {
    this.totalPrice = 0;
  }
  next();
});

const Cart = mongoose.model<CartModel>("Cart", cartSchema);

export default Cart;
