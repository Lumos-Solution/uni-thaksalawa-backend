import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Class } from '../schema/ClassSchema';
import { geocodeTown } from '../service/GeocodeService';

/*
 * A physical class with a town name but no position never appears in a
 * "classes near me" search - either it predates geocoding, or the lookup was
 * down when it was saved. This gives those classes a position, and can be run
 * again safely: it only ever touches the ones still missing one.
 *
 * Run with: npx ts-node scripts/backfillCoordinates.ts
 */
const backfill = async () => {
    await connectDB();

    const classes = await Class.find({
        classType: 'physical',
        $or: [{ coordinates: { $exists: false } }, { coordinates: null }],
    });

    console.log(`${classes.length} physical class(es) without a position.`);

    for (const cls of classes) {
        const coordinates = await geocodeTown(cls.location);

        if (!coordinates) {
            console.log(`  ${cls.classId}: could not place "${cls.location}" - skipped`);
            continue;
        }

        cls.coordinates = coordinates;
        await cls.save();
        console.log(`  ${cls.classId}: ${cls.location} -> ${coordinates.lat}, ${coordinates.lng}`);

        // Nominatim asks for no more than one request a second.
        await new Promise((resolve) => setTimeout(resolve, 1100));
    }

    await mongoose.disconnect();
    console.log('Done.');
};

backfill().catch((error) => {
    console.error('Backfill failed:', error);
    process.exit(1);
});
