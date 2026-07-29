export class LateCheckInValidationError extends Error {
    constructor() {
        super("Check-in is valid for 20 minutes after it is creation.",)
    }
}