import {AnyFun, DummyFun, ErrorEnveloper, ErrorFun, OnOther} from "./types";
import {Either} from "@leyyo/either";
import {baseEnveloper} from "./base-enveloper-impl";

export class ErrorEnveloperImpl implements ErrorEnveloper{
    private _defaultLog: boolean;
    private readonly _defaultKnownErrors: Array<Function>;
    private _defaultOnOther: OnOther;

    constructor() {
        this._defaultLog = true;
        this._defaultKnownErrors = [];
        this._defaultOnOther = null;
    }

    defaultKnownErrors(...classes: Array<Function>): void {
        classes.forEach(cls => {
            if (!this._defaultKnownErrors.includes(cls)) {
                this._defaultKnownErrors.push(cls);
            }
        });
    }

    defaultLog(log: boolean): void {
        this._defaultLog = log;
    }

    defaultOnOther(onOther: OnOther): void {
        this._defaultOnOther = onOther;
    }

    swallow<T>(fn: AnyFun<T>, def: T = null, log?: boolean): T {
        if (typeof log !== 'boolean') {
            log = this._defaultLog;
        }
        return baseEnveloper.swallow(fn, def, log);
    }

    handle<T>(fn: AnyFun<T>, onError: ErrorFun<T>, def: T = null, log?: boolean): T {
        if (typeof log !== 'boolean') {
            log = this._defaultLog;
        }
        return baseEnveloper.handle(fn, onError, def, log);
    }

    ignore(fn: DummyFun, log?: boolean): void {
        if (typeof log !== 'boolean') {
            log = this._defaultLog;
        }
        baseEnveloper.ignore(fn, log);
    }


    /**
     * Casts any unexpected condition to exception with given lambda expression
     */
    propagate<T>(fn: AnyFun<T>, onOther?: OnOther): T {
        if (typeof onOther !== 'function') {
            onOther = this._defaultOnOther;
        }
        return baseEnveloper.propagate(fn, this._defaultKnownErrors, onOther);
    }

    either<T>(fn: AnyFun<T>, log?: boolean): Either<T, Error> {
        if (typeof log !== 'boolean') {
            log = this._defaultLog;
        }
        return baseEnveloper.either(fn, log);
    }

}