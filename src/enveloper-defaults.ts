import {ErrorEnveloperDefaults, ErrorEnveloperDefaultsExport, OnOtherAsyncFun, OnOtherFun} from "./types";

export class EnveloperDefaultsImpl implements ErrorEnveloperDefaults, ErrorEnveloperDefaultsExport {
    _log: boolean;
    readonly _knownErrors: Array<Function>;
    readonly _ignoredErrors: Array<Function>;
    _onOther: OnOtherFun;
    _onOtherAsync: OnOtherAsyncFun;

    constructor() {
        this._log = true;
        this._knownErrors = [];
        this._ignoredErrors = [];
        this._onOther = (e) => e;
        this._onOtherAsync = async (e) => e;
    }

    logAll(log: boolean): ErrorEnveloperDefaults {
        this._log = log;
        return this;
    }

    ignoredErrors(...classes: Array<Function>): ErrorEnveloperDefaults {
        classes.forEach((cls, index) => {
            if (typeof cls !== 'function') {
                console.error(`ignoredErrors => error class[${index}] is not function => ${typeof cls}`);
            }
            else {
                const ix = this._knownErrors.indexOf(cls);
                if (ix >= 0) {
                    console.log(`Error[${cls.name}] is removed from known errors`);
                    this._knownErrors.splice(ix, 1);
                }
                if (!this._ignoredErrors.includes(cls)) {
                    this._ignoredErrors.push(cls);
                }
            }
        });
        return this;
    }
    knownErrors(...classes: Array<Function>): ErrorEnveloperDefaults {
        classes.forEach((cls, index) => {
            if (typeof cls !== 'function') {
                console.error(`knownErrors => error class[${index}] is not function => ${typeof cls}`);
            }
            else {
                const ix = this._ignoredErrors.indexOf(cls);
                if (ix >= 0) {
                    console.log(`Error[${cls.name}] is removed from ignored errors`);
                    this._ignoredErrors.splice(ix, 1);
                }
                if (!this._knownErrors.includes(cls)) {
                    this._knownErrors.push(cls);
                }
            }
        });
        return this;
    }


    onOtherErrorAsync(fn: OnOtherAsyncFun): ErrorEnveloperDefaults {
        if (typeof fn === 'function') {
            this._onOtherAsync = fn;
        }
        else {
            console.error(`onOtherErrorAsync => fn is not function => ${typeof fn}`);
        }
        return this;
    }

    onOtherError(fn: OnOtherFun): ErrorEnveloperDefaults {
        if (typeof fn === 'function') {
            this._onOther = fn;
        }
        else {
            console.error(`onOtherError => fn is not function => ${typeof fn}`);
        }
        return this;
    }
}
export const enveloperDefaults: ErrorEnveloperDefaults = new EnveloperDefaultsImpl();
export const errorEnveloperDefaults = enveloperDefaults;