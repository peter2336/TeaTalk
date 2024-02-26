const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/tea-talk/image/upload/v1708924234/mhjqyoklm4aof9s7igul.png",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      let hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      return next();
    }
  } catch (error) {
    console.log(error);
    return next();
  }
});

module.exports = mongoose.model("User", userSchema);
