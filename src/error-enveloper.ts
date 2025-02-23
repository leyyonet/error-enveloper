import {
    DummyAnyFun,
    DummyFun,
    ErrorEnveloper,
    ErrorEnveloperDefaultsExport,
    OnErrorAnyFun, OnErrorFun,
    OnOtherAnyFun, OnOtherFun,
    SimpleAnyFun,
    SimpleFun
} from "./types";
import {Either} from "@leyyo/either";
import {errorEnveloperDefaults} from "./enveloper-defaults";

class ErrorEnveloperImpl implements ErrorEnveloper {
    private defaults: ErrorEnveloperDefaultsExport;

    constructor() {
        this.defaults = errorEnveloperDefaults as unknown as ErrorEnveloperDefaultsExport;
    }
    protected logIt(fn: string, e: Error, log: boolean): void {
        if (log ?? this.defaults._log) {
            console.error(`${fn} => ${e.message}`, e);
        }
    }

    // region swallow
    swallow<T>(fn: SimpleFun<T>, def?: T, log?: boolean): T {
        try {
            return fn();
        } catch (e) {
            if (!this.defaults._ignoredErrors.includes(e.constructor)) {
                this.logIt('swallow', e, log);
            }
            return def ?? null;
        }
    }
    async swallowAsync<T>(fn: SimpleAnyFun<T>, def?: T, log?: boolean): Promise<T> {
        try {
            return await fn();
        } catch (e) {
            if (!this.defaults._ignoredErrors.includes(e.constructor)) {
                this.logIt('swallowAsync', e, log);
            }
            return def ?? null;
        }
    }
    // endregion swallow

    // region handle
    handle<T>(fn: SimpleFun<T>, onError: OnErrorFun<T>, def?: T, log?: boolean): T {
        try {
            return fn();
        } catch (e) {
            if (!this.defaults._ignoredErrors.includes(e.constructor)) {
                this.logIt('handle', e, log);
            }
            return this.swallow(() => onError(e), def, log);
        }
    }

    async handleAsync<T>(fn: SimpleAnyFun<T>, onError: OnErrorAnyFun<T>, def?: T, log?: boolean): Promise<T> {
        try {
            return await fn();
        } catch (e) {
            if (!this.defaults._ignoredErrors.includes(e.constructor)) {
                this.logIt('handleAsync', e, log);
            }
            return this.swallowAsync(() => onError(e), def, log);
        }
    }
    // endregion handle

    // region ignore
    ignore(fn: DummyFun, log?: boolean): void {
        try {
            fn();
        } catch (e) {
            if (!this.defaults._ignoredErrors.includes(e.constructor)) {
                this.logIt('ignore', e, log);
            }
        }
    }
    async ignoreAsync(fn: DummyAnyFun, log?: boolean): Promise<void> {
        try {
            await fn();
        } catch (e) {
            if (!this.defaults._ignoredErrors.includes(e.constructor)) {
                this.logIt('ignoreAsync', e, log);
            }
        }
    }
    // endregion ignore


    // region propagate
    propagate<T>(fn: SimpleFun<T>, onOther?: OnOtherFun, def?: T): T {
        try {
            return fn();
        } catch (e) {
            if (!this.defaults._ignoredErrors.includes(e.constructor)) {
                return def ?? null;
            }
            if (this.defaults._knownErrors.includes(e.constructor)) {
                throw e;
            }
            this.defaults._knownErrors.forEach(cls => {
                if (e instanceof cls) {
                    throw e;
                }
            });
            if (typeof onOther === 'function') {
                throw onOther(e);
            }
            throw this.defaults._onOther(e);
        }
    }
    async propagateAsync<T>(fn: SimpleAnyFun<T>, onOther?: OnOtherAnyFun, def?: T): Promise<T> {
        try {
            return await fn();
        } catch (e) {
            if (!this.defaults._ignoredErrors.includes(e.constructor)) {
                return def ?? null;
            }
            if (this.defaults._knownErrors.includes(e.constructor)) {
                throw e;
            }
            this.defaults._knownErrors.forEach(cls => {
                if (e instanceof cls) {
                    throw e;
                }
            });
            if (typeof onOther === 'function') {
                throw await onOther(e);
            }
            throw await this.defaults._onOtherAsync(e);
        }
    }
    // endregion propagate

    // region either
    either<T>(fn: SimpleFun<T>, log?: boolean): Either<T, Error> {
        try {
            return Either.first(fn()) as Either<T, Error>;
        } catch (e) {
            this.logIt('either', e, log);
            return Either.second(e) as Either<T, Error>;
        }
    }

    async eitherAsync<T>(fn: SimpleAnyFun<T>, log?: boolean): Promise<Either<T, Error>> {
        try {
            return Either.first(await fn()) as Either<T, Error>;
        } catch (e) {
            this.logIt('eitherAsync', e, log);
            return Either.second(e) as Either<T, Error>;
        }
    }
    // endregion either
}
export const errorEnveloper:ErrorEnveloper = new ErrorEnveloperImpl();
// noinspection JSUnusedGlobalSymbols
export const enveloper = errorEnveloper; // just alias