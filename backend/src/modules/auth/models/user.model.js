import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    recoveryKey: {
      type: String,
      required: true,
    }
  },
  { timestamps: true },
);

UserSchema.pre('save', async function() {
  const tasks = [];
  if (this.isModified('password')) {
    tasks.push(
      bcrypt.hash(this.password, 10).then((h) => { this.password = h; })
    );
  }
  if (this.isModified('recoveryKey')) {
    tasks.push(
      bcrypt.hash(this.recoveryKey, 10).then((h) => { this.recoveryKey = h; })
    );
  }
  await Promise.all(tasks);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
