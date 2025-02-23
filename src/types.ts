import {Either} from "@leyyo/either";

export type DummyFun = () => unknown;
export type DummyAsyncFun = () => Promise<unknown>;
export type DummyAnyFun = DummyFun|DummyAsyncFun;

export type SimpleFun<T> = () => T;
export type SimpleAsyncFun<T> = () => Promise<T>;
export type SimpleAnyFun<T> = SimpleFun<T> | SimpleAsyncFun<T>;

export type OnErrorFun<T> = (e?: Error) => T;
export type OnErrorAsyncFun<T> = (e?: Error) => Promise<T>;
export type OnErrorAnyFun<T> = OnErrorFun<T>|OnErrorAsyncFun<T>;

export type OnOtherFun = (e?: Error) => Error;
export type OnOtherAsyncFun = (e?: Error) => Promise<Error>;
export type OnOtherAnyFun = OnOtherFun|OnOtherAsyncFun;

export interface ErrorEnveloperDefaults {
    logAll(log: boolean): ErrorEnveloperDefaults;

    ignoredErrors(...classes: Array<Function>): ErrorEnveloperDefaults;
    knownErrors(...classes: Array<Function>): ErrorEnveloperDefaults;

    onOtherError(fn: OnOtherFun): ErrorEnveloperDefaults;
    onOtherErrorAsync(fn: OnOtherAsyncFun): ErrorEnveloperDefaults;
}
export interface ErrorEnveloperDefaultsExport {
    _log: boolean;
    _knownErrors: Array<Function>;
    _ignoredErrors: Array<Function>;
    _onOther: OnOtherFun;
    _onOtherAsync: OnOtherAsyncFun;
}

export interface ErrorEnveloper {
    // region swallow
    swallow<T>(fn: SimpleFun<T>): T;
    swallow<T>(fn: SimpleFun<T>, def: T): T;
    swallow<T>(fn: SimpleFun<T>, def: T, log: boolean): T;

    swallowAsync<T>(fn: SimpleAnyFun<T>): Promise<T>;
    swallowAsync<T>(fn: SimpleAnyFun<T>, def: T): Promise<T>;
    swallowAsync<T>(fn: SimpleAnyFun<T>, def: T, log: boolean): Promise<T>;
    // endregion swallow


    // region handle
    handle<T>(fn: SimpleFun<T>, onError: OnErrorFun<T>): T;
    handle<T>(fn: SimpleFun<T>, onError: OnErrorFun<T>, def: T): T;
    handle<T>(fn: SimpleFun<T>, onError: OnErrorFun<T>, def: T, log: boolean): T;

    handleAsync<T>(fn: SimpleAnyFun<T>, onError: OnErrorAnyFun<T>): Promise<T>;
    handleAsync<T>(fn: SimpleAnyFun<T>, onError: OnErrorAnyFun<T>, def: T): Promise<T>;
    handleAsync<T>(fn: SimpleAnyFun<T>, onError: OnErrorAnyFun<T>, def: T, log: boolean): Promise<T>;
    // endregion handle

    // region ignore
    ignore(fn: DummyFun): void;
    ignore(fn: DummyFun, log: boolean): void;
    ignoreAsync(fn: DummyAnyFun): Promise<void>;
    ignoreAsync(fn: DummyAnyFun, log: boolean): Promise<void>;
    // endregion ignore


    // region propagate
    /**
     * Casts any unexpected condition to exception with given lambda expression
     */
    propagate<T>(fn: SimpleFun<T>): T;
    propagate<T>(fn: SimpleFun<T>, onOther: OnOtherFun): T;
    propagate<T>(fn: SimpleFun<T>, onOther: OnOtherFun, def: T): T;
    propagateAsync<T>(fn: SimpleAnyFun<T>): Promise<T>;
    propagateAsync<T>(fn: SimpleAnyFun<T>, onOther: OnOtherAnyFun): Promise<T>;
    propagateAsync<T>(fn: SimpleAnyFun<T>, onOther: OnOtherAnyFun, def: T): Promise<T>;
    // endregion propagate

    // region either
    either<T>(fn: SimpleFun<T>): Either<T, Error>;
    either<T>(fn: SimpleFun<T>, log: boolean): Either<T, Error>;
    eitherAsync<T>(fn: SimpleAnyFun<T>): Promise<Either<T, Error>>;
    eitherAsync<T>(fn: SimpleAnyFun<T>, log: boolean): Promise<Either<T, Error>>;
    // endregion either


}