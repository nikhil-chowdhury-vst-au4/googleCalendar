"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSafeReadOnlyGlobal = void 0;
const addSafeReadOnlyGlobal = (prop, val) => {
    Object.defineProperty(global, prop, {
        get: function () {
            return val;
        },
        set: function () {
            console.log('You are trying to set the READONLY GLOBAL variable `', prop, '`. This is not permitted. Ignored!');
        }
    });
};
exports.addSafeReadOnlyGlobal = addSafeReadOnlyGlobal;
//# sourceMappingURL=main.utils.js.map