import mongoose from 'mongoose';

/*
 * The connection string comes from the environment so that database
 * credentials never live in the repository. See .env.example for the format.
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'MONGODB_URI must be set. Copy .env.example to .env and fill it in.'
    );
}

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/*
 * Atlas is reached through a DNS SRV lookup, which can fail on the first try
 * when the resolver is cold or the network has just changed. A single failed
 * lookup is not a reason to kill the server, so connection is retried before
 * giving up.
 */
export const connectDB = async () => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            await mongoose.connect(MONGODB_URI);
            console.log("MongoDB connected");
            return;
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(
                `MongoDB connection attempt ${attempt}/${MAX_ATTEMPTS} failed: ${message}`
            );

            if (attempt === MAX_ATTEMPTS) {
                console.error("MongoDB connection failed: giving up.");
                process.exit(1);
            }

            await wait(RETRY_DELAY_MS);
        }
    }
};
