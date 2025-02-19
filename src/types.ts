import {Either} from "@leyyo/either";

export type DummyFun = () => void;
export type AnyFun<T> = () => T;
export type ErrorFun<T> = (e?: Error) => T;
export type OnOther = (e?: Error) => Error;

export interface BaseEnveloper {
    swallow<T>(fn: AnyFun<T>): T;
    swallow<T>(fn: AnyFun<T>, def: T): T;
    swallow<T>(fn: AnyFun<T>, def: T, log: boolean): T;

    handle<T>(fn: AnyFun<T>, onError: ErrorFun<T>): T;
    handle<T>(fn: AnyFun<T>, onError: ErrorFun<T>, def: T): T;
    handle<T>(fn: AnyFun<T>, onError: ErrorFun<T>, def: T, log: boolean): T;

    ignore(fn: DummyFun): void;
    ignore(fn: DummyFun, log: boolean): void;

    propagate<T>(fn: AnyFun<T>, knownErrors: Array<Function>, onOther: OnOther): T;

    either<T>(fn: AnyFun<T>): Either<T, Error>;
    either<T>(fn: AnyFun<T>, log: boolean): Either<T, Error>;
}

export interface ErrorEnveloper {
    defaultLog(log: boolean): void;
    defaultKnownErrors(...classes: Array<Function>): void;
    defaultOnOther(onOther: OnOther): void;

    swallow<T>(fn: AnyFun<T>): T;
    swallow<T>(fn: AnyFun<T>, def: T): T;
    swallow<T>(fn: AnyFun<T>, def: T, log: boolean): T;

    handle<T>(fn: AnyFun<T>, onError: ErrorFun<T>): T;
    handle<T>(fn: AnyFun<T>, onError: ErrorFun<T>, def: T): T;
    handle<T>(fn: AnyFun<T>, onError: ErrorFun<T>, def: T, log: boolean): T;

    ignore(fn: DummyFun): void;
    ignore(fn: DummyFun, log: boolean): void;

    propagate<T>(fn: AnyFun<T>): T;
    propagate<T>(fn: AnyFun<T>, onOther: OnOther): T;

    either<T>(fn: AnyFun<T>): Either<T, Error>;
    either<T>(fn: AnyFun<T>, log: boolean): Either<T, Error>;
}