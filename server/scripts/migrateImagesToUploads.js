// server/scripts/migrateImagesToUploads.js
// One-off migration: moves menu images out of client/public/images/menu
// into server/uploads/menu (so they survive a production frontend build),
// and rewrites every MenuItems.image / Order.items[].image reference to match.
//
// Usage:
//   node scripts/migrateImagesToUploads.js          (dry run — logs planned changes only)
//   node scripts/migrateImagesToUploads.js --apply   (actually moves files + updates the DB)
const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const MenuItem = require('../models/MenuItems');
const Order = require('../models/Order');

const APPLY = process.argv.includes('--apply');

const OLD_ROOT = path.join(__dirname, '../../client/public/images/menu');
const NEW_ROOT = path.join(__dirname, '../uploads/menu');
const OLD_PREFIX = '/images/menu/';
const NEW_PREFIX = '/uploads/menu/';

function moveFolders() {
  if (!fs.existsSync(OLD_ROOT)) {
    console.log(`No folder at ${OLD_ROOT} — nothing to move.`);
    return;
  }

  const categories = fs.readdirSync(OLD_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const category of categories) {
    const oldDir = path.join(OLD_ROOT, category);
    const newDir = path.join(NEW_ROOT, category);
    const files = fs.readdirSync(oldDir);

    console.log(`${category}/: ${files.length} file(s) -> ${path.relative(process.cwd(), newDir)}`);

    if (!APPLY) continue;

    fs.mkdirSync(newDir, { recursive: true });
    for (const file of files) {
      fs.renameSync(path.join(oldDir, file), path.join(newDir, file));
    }
    fs.rmdirSync(oldDir);
  }

  if (APPLY && fs.existsSync(OLD_ROOT) && fs.readdirSync(OLD_ROOT).length === 0) {
    fs.rmdirSync(OLD_ROOT);
    console.log(`Removed now-empty ${OLD_ROOT}`);
  }
}

async function migrateMenuItems() {
  const docs = await MenuItem.find({ image: { $regex: `^${OLD_PREFIX}` } });
  console.log(`MenuItems to update: ${docs.length}`);
  for (const doc of docs) {
    const newImage = NEW_PREFIX + doc.image.slice(OLD_PREFIX.length);
    console.log(`  ${doc.name}: ${doc.image} -> ${newImage}`);
    if (APPLY) {
      doc.image = newImage;
      await doc.save();
    }
  }
}

async function migrateOrders() {
  const docs = await Order.find({ 'items.image': { $regex: `^${OLD_PREFIX}` } });
  console.log(`Orders to update: ${docs.length}`);
  for (const doc of docs) {
    let changed = false;
    for (const item of doc.items) {
      if (item.image && item.image.startsWith(OLD_PREFIX)) {
        const newImage = NEW_PREFIX + item.image.slice(OLD_PREFIX.length);
        console.log(`  Order ${doc.orderNumber} / ${item.name}: ${item.image} -> ${newImage}`);
        item.image = newImage;
        changed = true;
      }
    }
    if (APPLY && changed) {
      await doc.save();
    }
  }
}

async function main() {
  console.log(APPLY ? 'Running in APPLY mode\n' : 'Running in DRY-RUN mode (pass --apply to make changes)\n');

  await connectDB();

  console.log('--- Folder moves ---');
  moveFolders();

  console.log('\n--- MenuItems ---');
  await migrateMenuItems();

  console.log('\n--- Orders ---');
  await migrateOrders();

  console.log('\nDone.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
