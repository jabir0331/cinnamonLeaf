// server/scripts/seedCategories.js
// One-off seed: creates the 4 categories that already exist implicitly as free-text
// strings on MenuItems, so the new Category-managed UI/homepage isn't empty.
//
// Usage:
//   node scripts/seedCategories.js          (dry run — logs planned changes only)
//   node scripts/seedCategories.js --apply   (actually creates the categories)
const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const Category = require('../models/Category');

const APPLY = process.argv.includes('--apply');

const UPLOADS_DIR = path.join(__dirname, '../uploads/categories');
const MENU_UPLOADS_DIR = path.join(__dirname, '../uploads/menu');

const CATEGORIES = [
  {
    name: 'Starters',
    slug: 'starters',
    description: 'Light bites and shareable plates to begin your meal.',
    sourceImage: path.join(MENU_UPLOADS_DIR, 'starters', 'bruschettaTrio.jpg'),
  },
  {
    name: 'Main Courses',
    slug: 'main-courses',
    description: 'Hearty, chef-crafted dishes at the heart of the menu.',
    sourceImage: path.join(MENU_UPLOADS_DIR, 'main_courses', 'hyderabadChickenBiriyani.jpg'),
  },
  {
    name: 'Desserts',
    slug: 'desserts',
    description: 'Sweet finishes to round off your dining experience.',
    sourceImage: path.join(MENU_UPLOADS_DIR, 'desserts', 'chocolateLavaCake.jpg'),
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Refreshing drinks, mocktails, and coffee to pair with your meal.',
    sourceImage: path.join(MENU_UPLOADS_DIR, 'beverages', 'vanillaMilkshake.jpg'),
  },
];

async function main() {
  console.log(APPLY ? 'Running in APPLY mode\n' : 'Running in DRY-RUN mode (pass --apply to make changes)\n');

  await connectDB();

  for (const cat of CATEGORIES) {
    const existing = await Category.findOne({ slug: cat.slug });
    if (existing) {
      console.log(`Skipping "${cat.name}" — already exists.`);
      continue;
    }

    const ext = path.extname(cat.sourceImage);
    const filename = `${cat.slug}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const destImage = path.join(UPLOADS_DIR, filename);
    const imagePath = `/uploads/categories/${filename}`;

    console.log(`Create "${cat.name}" -> slug "${cat.slug}", image ${imagePath}`);

    if (!APPLY) continue;

    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    fs.copyFileSync(cat.sourceImage, destImage);

    await Category.create({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: imagePath,
      isActive: true,
    });
  }

  console.log('\nDone.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
