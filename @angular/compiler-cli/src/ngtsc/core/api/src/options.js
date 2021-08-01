/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/core/api/src/options", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvY29yZS9hcGkvc3JjL29wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0JhemVsQW5kRzNPcHRpb25zLCBJMThuT3B0aW9ucywgTGVnYWN5TmdjT3B0aW9ucywgTWlzY09wdGlvbnMsIE5nY0NvbXBhdGliaWxpdHlPcHRpb25zLCBTdHJpY3RUZW1wbGF0ZU9wdGlvbnN9IGZyb20gJy4vcHVibGljX29wdGlvbnMnO1xuXG5cbi8qKlxuICogTm9uLXB1YmxpYyBvcHRpb25zIHdoaWNoIGFyZSB1c2VmdWwgZHVyaW5nIHRlc3Rpbmcgb2YgdGhlIGNvbXBpbGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRlc3RPbmx5T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHVzZSB0aGUgQ29tcGlsZXJIb3N0J3MgZmlsZU5hbWVUb01vZHVsZU5hbWUgdXRpbGl0eSAoaWYgYXZhaWxhYmxlKSB0byBnZW5lcmF0ZVxuICAgKiBpbXBvcnQgbW9kdWxlIHNwZWNpZmllcnMuIFRoaXMgaXMgZmFsc2UgYnkgZGVmYXVsdCwgYW5kIGV4aXN0cyB0byBzdXBwb3J0IHJ1bm5pbmcgbmd0c2NcbiAgICogd2l0aGluIEdvb2dsZS4gVGhpcyBvcHRpb24gaXMgaW50ZXJuYWwgYW5kIGlzIHVzZWQgYnkgdGhlIG5nX21vZHVsZS5iemwgcnVsZSB0byBzd2l0Y2hcbiAgICogYmVoYXZpb3IgYmV0d2VlbiBCYXplbCBhbmQgQmxhemUuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX3VzZUhvc3RGb3JJbXBvcnRHZW5lcmF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVHVybiBvbiB0ZW1wbGF0ZSB0eXBlLWNoZWNraW5nIGluIHRoZSBJdnkgY29tcGlsZXIuXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gaW50ZXJuYWwgZmxhZyBiZWluZyB1c2VkIHRvIHJvbGwgb3V0IHRlbXBsYXRlIHR5cGUtY2hlY2tpbmcgaW4gbmd0c2MuIFR1cm5pbmcgaXQgb25cbiAgICogYnkgZGVmYXVsdCBiZWZvcmUgaXQncyByZWFkeSBtaWdodCBicmVhayBvdGhlciB1c2VycyBhdHRlbXB0aW5nIHRvIHRlc3QgdGhlIG5ldyBjb21waWxlcidzXG4gICAqIGJlaGF2aW9yLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGl2eVRlbXBsYXRlVHlwZUNoZWNrPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQW4gb3B0aW9uIHRvIGVuYWJsZSBuZ3RzYydzIGludGVybmFsIHBlcmZvcm1hbmNlIHRyYWNpbmcuXG4gICAqXG4gICAqIFRoaXMgc2hvdWxkIGJlIGEgcGF0aCB0byBhIEpTT04gZmlsZSB3aGVyZSB0cmFjZSBpbmZvcm1hdGlvbiB3aWxsIGJlIHdyaXR0ZW4uIEFuIG9wdGlvbmFsICd0czonXG4gICAqIHByZWZpeCB3aWxsIGNhdXNlIHRoZSB0cmFjZSB0byBiZSB3cml0dGVuIHZpYSB0aGUgVFMgaG9zdCBpbnN0ZWFkIG9mIGRpcmVjdGx5IHRvIHRoZSBmaWxlc3lzdGVtXG4gICAqIChub3QgYWxsIGhvc3RzIHN1cHBvcnQgdGhpcyBtb2RlIG9mIG9wZXJhdGlvbikuXG4gICAqXG4gICAqIFRoaXMgaXMgY3VycmVudGx5IG5vdCBleHBvc2VkIHRvIHVzZXJzIGFzIHRoZSB0cmFjZSBmb3JtYXQgaXMgc3RpbGwgdW5zdGFibGUuXG4gICAqL1xuICB0cmFjZVBlcmZvcm1hbmNlPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgdGhhdCBzcGVjaWZ5IGNvbXBpbGF0aW9uIHRhcmdldC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYXJnZXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgY29tcGlsYXRpb24gbW9kZSB0byB1c2UuIFRoZSBmb2xsb3dpbmcgbW9kZXMgYXJlIGF2YWlsYWJsZTpcbiAgICogLSAnZnVsbCc6IGdlbmVyYXRlcyBmdWxseSBBT1QgY29tcGlsZWQgY29kZSB1c2luZyBJdnkgaW5zdHJ1Y3Rpb25zLlxuICAgKiAtICdwYXJ0aWFsJzogZ2VuZXJhdGVzIGNvZGUgaW4gYSBzdGFibGUsIGJ1dCBpbnRlcm1lZGlhdGUgZm9ybSBzdWl0YWJsZSB0byBiZSBwdWJsaXNoZWQgdG8gTlBNLlxuICAgKlxuICAgKiBUbyBiZWNvbWUgcHVibGljIG9uY2UgdGhlIGxpbmtlciBpcyByZWFkeS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBjb21waWxhdGlvbk1vZGU/OiAnZnVsbCd8J3BhcnRpYWwnO1xufVxuXG4vKipcbiAqIEEgbWVyZ2VkIGludGVyZmFjZSBvZiBhbGwgb2YgdGhlIHZhcmlvdXMgQW5ndWxhciBjb21waWxlciBvcHRpb25zLCBhcyB3ZWxsIGFzIHRoZSBzdGFuZGFyZFxuICogYHRzLkNvbXBpbGVyT3B0aW9uc2AuXG4gKlxuICogQWxzbyBpbmNsdWRlcyBhIGZldyBtaXNjZWxsYW5lb3VzIG9wdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdDb21waWxlck9wdGlvbnMgZXh0ZW5kcyB0cy5Db21waWxlck9wdGlvbnMsIExlZ2FjeU5nY09wdGlvbnMsIEJhemVsQW5kRzNPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5nY0NvbXBhdGliaWxpdHlPcHRpb25zLCBTdHJpY3RUZW1wbGF0ZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGVzdE9ubHlPcHRpb25zLCBJMThuT3B0aW9ucywgVGFyZ2V0T3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNaXNjT3B0aW9ucyB7fVxuIl19