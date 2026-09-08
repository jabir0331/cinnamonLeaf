// server/scripts/createAdmin.js
// One-off bootstrap script: promotes an existing user to admin.
// Usage: node scripts/createAdmin.js someone@example.com
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/createAdmin.js <email>');
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user found with email ${email}`);
    process.exit(1);
  }

  user.role = 'admin';
  await user.save();

  console.log(`${email} is now an admin.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
