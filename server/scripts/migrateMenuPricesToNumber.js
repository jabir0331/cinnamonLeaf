// server/scripts/migrateMenuPricesToNumber.js
// One-off migration: converts MenuItems.price from a display string like
// "LKR 450.00" to a plain Number, bypassing Mongoose schema casting by
// writing through the native driver.
// Usage: node scripts/migrateMenuPricesToNumber.js [--apply]
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');

const APPLY = process.argv.includes('--apply');

const parsePrice = (priceStr) => {
    const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned);
    return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) / 100 : null;
};

async function main() {
    await connectDB();

    const collection = require('mongoose').connection.db.collection('menuitems');
    const docs = await collection.find({}).toArray();

    console.log(`Found ${docs.length} menu items.`);

    let toUpdate = 0;
    let skipped = 0;

    for (const doc of docs) {
        if (typeof doc.price !== 'string') {
            console.log(`SKIP  ${doc.name}: price is already ${typeof doc.price} (${doc.price})`);
            skipped++;
            continue;
        }

        const numericPrice = parsePrice(doc.price);

        if (numericPrice === null) {
            console.log(`WARN  ${doc.name}: could not parse price "${doc.price}" - leaving untouched`);
            skipped++;
            continue;
        }

        console.log(`${APPLY ? 'UPDATE' : 'DRY RUN'}  ${doc.name}: "${doc.price}" -> ${numericPrice}`);
        toUpdate++;

        if (APPLY) {
            await collection.updateOne({ _id: doc._id }, { $set: { price: numericPrice } });
        }
    }

    console.log(`\n${toUpdate} item(s) ${APPLY ? 'updated' : 'would be updated'}, ${skipped} skipped.`);
    if (!APPLY) {
        console.log('Dry run only - re-run with --apply to write changes.');
    }

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
