const mongoose = require("mongoose");
const { sendWelcomeEmail } = require("../utils/emailService");

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
        validator: function (v) {
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

// Create virtual field
userSchema.virtual("daysAgo").get(function () {
  const now = new Date();
  const created = this.createdAt;
  const diffInMs = now - created;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
});

// Enable virtuals in JSON output
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Pre-save hook to set a flag
userSchema.pre("save", function () {
  this.wasNew = this.isNew; // Store isNew status
});

// Post-Save hook - runs after saving
userSchema.post("save", async function (doc) {
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
