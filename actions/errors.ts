/**
 * Error thrown by action helpers when a service call fails.
 * Carries the chain `stage` and a `userMessage`, and keeps the original
 * error in `cause` for logging / the events table.
 *
 * Created in a helper (which knows the business context), consumed in the
 * entry action's `catch`.
 */
export class ActionError extends Error {
    constructor(
        public stage: string,
        public userMessage: string,
        options?: { cause?: unknown }
    ) {
        super(stage, options)
        this.name = "ActionError"
    }
}
