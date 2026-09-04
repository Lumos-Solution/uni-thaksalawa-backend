/**
 * An error that already knows which HTTP status it should produce, so services
 * can reject a request for a business reason ("already enrolled", "not your
 * class") without every controller having to guess between 400, 403 and 500.
 */
export class AppError extends Error {
    status: number;

    constructor(message: string, status = 400) {
        super(message);
        this.status = status;
    }
}

/** Status to answer with: an AppError carries its own, anything else is a bug. */
export const statusOf = (error: unknown) =>
    error instanceof AppError ? error.status : 500;
