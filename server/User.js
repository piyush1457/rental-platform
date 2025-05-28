const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if the password is new or modified
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(this.password, saltRounds);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
