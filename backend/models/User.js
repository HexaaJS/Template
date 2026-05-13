const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Le pseudo est obligatoire'],
      unique: true,
      trim: true,
      minlength: [3, 'Minimum 3 caractères'],
      maxlength: [20, 'Maximum 20 caractères'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Minimum 6 caractères'],
      select: false, // jamais renvoyé par défaut dans les queries
    },
    avatar: {
      type: String,
      default: null, // URL audio/image plus tard
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Hash password avant save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode pour comparer les passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);