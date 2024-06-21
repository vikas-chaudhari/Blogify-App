const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { verifyToken, createToken } = require("../services/authentication");

const userSchema = Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "defaultProfile.jpg",
    },
    role: {
      type: String,
      enum: ["NORMAL", "ADMIN"],
      default: "NORMAL",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;

  this.password = hashedPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    try {
      if (!user) throw new Error("No user found with this email");

      const hashedPassword = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");
      if (hashedPassword === user.password) {
        const token = createToken(user);
        return token;
      } else {
        throw new Error("Password doesnt matches");
        return false;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
);

const userModel = model("users", userSchema);

module.exports = { userModel };
