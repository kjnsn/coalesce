export default class Coalesce {
    buckets: Map<string, Array<(value: any) => any>>;
    windowMs: number;

    constructor(windowMs: number) {
        this.buckets = new Map();
        this.windowMs = windowMs;
    }

    
    queueCommand<T>(key: string, fn: () => T, cb: (value: T) => any) {
        if (this.buckets.has(key)) {
            const callbacks = this.buckets.get(key);
            if (callbacks == null) {
                return;
            }
            callbacks.push(cb);
            return;
        }

        // Wait for windowMs, then execute fn.
        this.buckets.set(key, [cb]);
        setTimeout(() => {
            const result = fn();
            const callbacks = this.buckets.get(key);
            if (callbacks == null) {
                return;
            }
            while (callbacks.length > 0) {
                const cb = callbacks.pop();
                if (typeof cb === "function") {
                    cb(result);
                }
            }
            this.buckets.delete(key);
        }, this.windowMs);
    }
}
