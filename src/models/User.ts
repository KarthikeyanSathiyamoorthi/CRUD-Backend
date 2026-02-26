import { Document } from "mongoose";
const mongoose = require("mongoose");
const { sendWelcomeEmail } = require("../utils/emailService");

interface IUser extends Document {
  wasNew?: boolean;
  isNew: boolean;
}

// Define the structure of the User Date
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // automatically converts to lowercase
      validate: {
        validator: function (v: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Enable virtuals in JSON output
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Pre-save hook to set a flag
userSchema.pre("save", function (this: IUser) {
  this.wasNew = this.isNew; // Store isNew status
});

// Post-Save hook - runs after saving
userSchema.post("save", async function (doc: any) {
  // Check if this is a new user (not an update)
  if (doc.wasNew) {
    try {
      await sendWelcomeEmail(doc.email, doc.name);
    } catch (error) {
      console.log(`Failed to send welcome email: ${error}`);
      // Don't block user creation if email fails
    }
  }
});

// Create and export the Model
const User = mongoose.model("User", userSchema);
module.exports = User;
export {};
