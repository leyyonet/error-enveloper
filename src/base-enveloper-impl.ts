/**
 *
 * Generics:
 * <li> {@code E} - exception class
 * <li> {@code T} - return type of enveloped expression
 * */
import {AnyFun, BaseEnveloper, DummyFun, ErrorFun, OnOther} from "./types";
import {Either} from "@leyyo/either";

class BaseEnveloperImpl implements BaseEnveloper{
    swallow<T>(fn: AnyFun<T>, def: T = null, log?: boolean): T {
        try {
            return fn();
        } catch (e) {
            if (log) {
                console.log(e);
            }
            return def;
        }
    }

    handle<T>(fn: AnyFun<T>, onError: ErrorFun<T>, def: T = null, log?: boolean): T {
        try {
            return fn();
        } catch (e) {
            return this.swallow(() => onError(e), def, log);
        }
    }

    ignore(fn: DummyFun, log?: boolean): void {
        try {
            fn();
        } catch (e) {
            if (log) {
                console.log(e);
            }
        }
    }


    /**
     * Casts any unexpected condition to exception with given lambda expression
     */
    propagate<T>(fn: AnyFun<T>, knownErrors: Array<Function>, onOther: OnOther): T {
        try {
            return fn();
        } catch (e) {
            knownErrors.forEach(cls => {
                if (e instanceof cls) {
                    throw e;
                }
            })
            throw onOther(e);
        }
    }

    either<T>(fn: AnyFun<T>, log?: boolean): Either<T, Error> {
        let result: Either;
        try {
            result = Either.first(fn());
        } catch (e) {
            if (log) {
                console.log(e);
            }
            result = Either.second(e);
        }
        return result as Either<T, Error>;
    }
}
export const baseEnveloper = new BaseEnveloperImpl();