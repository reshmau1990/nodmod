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
        define("@angular/compiler-cli/src/ngtsc/typecheck/api/completion", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CompletionKind = void 0;
    /**
     * Discriminant of an autocompletion source (a `Completion`).
     */
    var CompletionKind;
    (function (CompletionKind) {
        CompletionKind[CompletionKind["Reference"] = 0] = "Reference";
        CompletionKind[CompletionKind["Variable"] = 1] = "Variable";
    })(CompletionKind = exports.CompletionKind || (exports.CompletionKind = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL2FwaS9jb21wbGV0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQVdIOztPQUVHO0lBRUgsSUFBWSxjQUdYO0lBSEQsV0FBWSxjQUFjO1FBQ3hCLDZEQUFTLENBQUE7UUFDVCwyREFBUSxDQUFBO0lBQ1YsQ0FBQyxFQUhXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBR3pCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VG1wbEFzdFJlZmVyZW5jZSwgVG1wbEFzdFZhcmlhYmxlfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmltcG9ydCB7U2hpbUxvY2F0aW9ufSBmcm9tICcuL3N5bWJvbHMnO1xuXG4vKipcbiAqIEFuIGF1dG9jb21wbGV0aW9uIHNvdXJjZSBvZiBhbnkga2luZC5cbiAqL1xuZXhwb3J0IHR5cGUgQ29tcGxldGlvbiA9IFJlZmVyZW5jZUNvbXBsZXRpb258VmFyaWFibGVDb21wbGV0aW9uO1xuXG4vKipcbiAqIERpc2NyaW1pbmFudCBvZiBhbiBhdXRvY29tcGxldGlvbiBzb3VyY2UgKGEgYENvbXBsZXRpb25gKS5cbiAqL1xuXG5leHBvcnQgZW51bSBDb21wbGV0aW9uS2luZCB7XG4gIFJlZmVyZW5jZSxcbiAgVmFyaWFibGUsXG59XG5cbi8qKlxuICogQW4gYXV0b2NvbXBsZXRpb24gcmVzdWx0IHJlcHJlc2VudGluZyBhIGxvY2FsIHJlZmVyZW5jZSBkZWNsYXJlZCBpbiB0aGUgdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVmZXJlbmNlQ29tcGxldGlvbiB7XG4gIGtpbmQ6IENvbXBsZXRpb25LaW5kLlJlZmVyZW5jZTtcblxuICAvKipcbiAgICogVGhlIGBUbXBsQXN0UmVmZXJlbmNlYCBmcm9tIHRoZSB0ZW1wbGF0ZSB3aGljaCBzaG91bGQgYmUgYXZhaWxhYmxlIGFzIGEgY29tcGxldGlvbi5cbiAgICovXG4gIG5vZGU6IFRtcGxBc3RSZWZlcmVuY2U7XG59XG5cbi8qKlxuICogQW4gYXV0b2NvbXBsZXRpb24gcmVzdWx0IHJlcHJlc2VudGluZyBhIHZhcmlhYmxlIGRlY2xhcmVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWYXJpYWJsZUNvbXBsZXRpb24ge1xuICBraW5kOiBDb21wbGV0aW9uS2luZC5WYXJpYWJsZTtcblxuICAvKipcbiAgICogVGhlIGBUbXBsQXN0VmFyaWFibGVgIGZyb20gdGhlIHRlbXBsYXRlIHdoaWNoIHNob3VsZCBiZSBhdmFpbGFibGUgYXMgYSBjb21wbGV0aW9uLlxuICAgKi9cbiAgbm9kZTogVG1wbEFzdFZhcmlhYmxlO1xufVxuXG4vKipcbiAqIEF1dG9jb21wbGV0aW9uIGRhdGEgZm9yIGFuIGV4cHJlc3Npb24gaW4gdGhlIGdsb2JhbCBzY29wZS5cbiAqXG4gKiBHbG9iYWwgY29tcGxldGlvbiBpcyBhY2NvbXBsaXNoZWQgYnkgbWVyZ2luZyBkYXRhIGZyb20gdHdvIHNvdXJjZXM6XG4gKiAgKiBUeXBlU2NyaXB0IGNvbXBsZXRpb24gb2YgdGhlIGNvbXBvbmVudCdzIGNsYXNzIG1lbWJlcnMuXG4gKiAgKiBMb2NhbCByZWZlcmVuY2VzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgaW4gc2NvcGUgYXQgYSBnaXZlbiB0ZW1wbGF0ZSBsZXZlbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxDb21wbGV0aW9uIHtcbiAgLyoqXG4gICAqIEEgbG9jYXRpb24gd2l0aGluIHRoZSB0eXBlLWNoZWNraW5nIHNoaW0gd2hlcmUgVHlwZVNjcmlwdCdzIGNvbXBsZXRpb24gQVBJcyBjYW4gYmUgdXNlZCB0b1xuICAgKiBhY2Nlc3MgY29tcGxldGlvbnMgZm9yIHRoZSB0ZW1wbGF0ZSdzIGNvbXBvbmVudCBjb250ZXh0IChjb21wb25lbnQgY2xhc3MgbWVtYmVycykuXG4gICAqL1xuICBjb21wb25lbnRDb250ZXh0OiBTaGltTG9jYXRpb247XG5cbiAgLyoqXG4gICAqIGBNYXBgIG9mIGxvY2FsIHJlZmVyZW5jZXMgYW5kIHZhcmlhYmxlcyB0aGF0IGFyZSB2aXNpYmxlIGF0IHRoZSByZXF1ZXN0ZWQgbGV2ZWwgb2YgdGhlXG4gICAqIHRlbXBsYXRlLlxuICAgKlxuICAgKiBTaGFkb3dpbmcgb2YgcmVmZXJlbmNlcy92YXJpYWJsZXMgZnJvbSBtdWx0aXBsZSBsZXZlbHMgb2YgdGhlIHRlbXBsYXRlIGhhcyBhbHJlYWR5IGJlZW5cbiAgICogYWNjb3VudGVkIGZvciBpbiB0aGUgcHJlcGFyYXRpb24gb2YgYHRlbXBsYXRlQ29udGV4dGAuIEVudHJpZXMgaGVyZSBzaGFkb3cgY29tcG9uZW50IG1lbWJlcnMgb2ZcbiAgICogdGhlIHNhbWUgbmFtZSAoZnJvbSB0aGUgYGNvbXBvbmVudENvbnRleHRgIGNvbXBsZXRpb25zKS5cbiAgICovXG4gIHRlbXBsYXRlQ29udGV4dDogTWFwPHN0cmluZywgUmVmZXJlbmNlQ29tcGxldGlvbnxWYXJpYWJsZUNvbXBsZXRpb24+O1xufVxuIl19