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
        define("@angular/compiler-cli/src/ngtsc/typecheck/api/symbols", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SymbolKind = void 0;
    var SymbolKind;
    (function (SymbolKind) {
        SymbolKind[SymbolKind["Input"] = 0] = "Input";
        SymbolKind[SymbolKind["Output"] = 1] = "Output";
        SymbolKind[SymbolKind["Binding"] = 2] = "Binding";
        SymbolKind[SymbolKind["Reference"] = 3] = "Reference";
        SymbolKind[SymbolKind["Variable"] = 4] = "Variable";
        SymbolKind[SymbolKind["Directive"] = 5] = "Directive";
        SymbolKind[SymbolKind["Element"] = 6] = "Element";
        SymbolKind[SymbolKind["Template"] = 7] = "Template";
        SymbolKind[SymbolKind["Expression"] = 8] = "Expression";
        SymbolKind[SymbolKind["DomBinding"] = 9] = "DomBinding";
    })(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL2FwaS9zeW1ib2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQVNILElBQVksVUFXWDtJQVhELFdBQVksVUFBVTtRQUNwQiw2Q0FBSyxDQUFBO1FBQ0wsK0NBQU0sQ0FBQTtRQUNOLGlEQUFPLENBQUE7UUFDUCxxREFBUyxDQUFBO1FBQ1QsbURBQVEsQ0FBQTtRQUNSLHFEQUFTLENBQUE7UUFDVCxpREFBTyxDQUFBO1FBQ1AsbURBQVEsQ0FBQTtRQUNSLHVEQUFVLENBQUE7UUFDVix1REFBVSxDQUFBO0lBQ1osQ0FBQyxFQVhXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBV3JCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VG1wbEFzdEVsZW1lbnQsIFRtcGxBc3RSZWZlcmVuY2UsIFRtcGxBc3RUZW1wbGF0ZSwgVG1wbEFzdFZhcmlhYmxlfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtBYnNvbHV0ZUZzUGF0aH0gZnJvbSAnLi4vLi4vZmlsZV9zeXN0ZW0nO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9ufSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcbmltcG9ydCB7RGlyZWN0aXZlSW5TY29wZX0gZnJvbSAnLi9zY29wZSc7XG5cbmV4cG9ydCBlbnVtIFN5bWJvbEtpbmQge1xuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBCaW5kaW5nLFxuICBSZWZlcmVuY2UsXG4gIFZhcmlhYmxlLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnQsXG4gIFRlbXBsYXRlLFxuICBFeHByZXNzaW9uLFxuICBEb21CaW5kaW5nLFxufVxuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgYW4gZW50aXR5IGluIHRoZSBgVGVtcGxhdGVBc3RgLlxuICovXG5leHBvcnQgdHlwZSBTeW1ib2wgPSBJbnB1dEJpbmRpbmdTeW1ib2x8T3V0cHV0QmluZGluZ1N5bWJvbHxFbGVtZW50U3ltYm9sfFJlZmVyZW5jZVN5bWJvbHxcbiAgICBWYXJpYWJsZVN5bWJvbHxFeHByZXNzaW9uU3ltYm9sfERpcmVjdGl2ZVN5bWJvbHxUZW1wbGF0ZVN5bWJvbHxEb21CaW5kaW5nU3ltYm9sO1xuXG4vKiogSW5mb3JtYXRpb24gYWJvdXQgd2hlcmUgYSBgdHMuTm9kZWAgY2FuIGJlIGZvdW5kIGluIHRoZSB0eXBlIGNoZWNrIGJsb2NrIHNoaW0gZmlsZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2hpbUxvY2F0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBmdWxseSBxdWFsaWZpZWQgcGF0aCBvZiB0aGUgZmlsZSB3aGljaCBjb250YWlucyB0aGUgZ2VuZXJhdGVkIFR5cGVTY3JpcHQgdHlwZSBjaGVja1xuICAgKiBjb2RlIGZvciB0aGUgY29tcG9uZW50J3MgdGVtcGxhdGUuXG4gICAqL1xuICBzaGltUGF0aDogQWJzb2x1dGVGc1BhdGg7XG5cbiAgLyoqIFRoZSBsb2NhdGlvbiBpbiB0aGUgc2hpbSBmaWxlIHdoZXJlIG5vZGUgYXBwZWFycy4gKi9cbiAgcG9zaXRpb25JblNoaW1GaWxlOiBudW1iZXI7XG59XG5cbi8qKlxuICogQSBnZW5lcmljIHJlcHJlc2VudGF0aW9uIG9mIHNvbWUgbm9kZSBpbiBhIHRlbXBsYXRlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRzTm9kZVN5bWJvbEluZm8ge1xuICAvKiogVGhlIGB0cy5UeXBlYCBvZiB0aGUgdGVtcGxhdGUgbm9kZS4gKi9cbiAgdHNUeXBlOiB0cy5UeXBlO1xuXG4gIC8qKiBUaGUgYHRzLlN5bWJvbGAgZm9yIHRoZSB0ZW1wbGF0ZSBub2RlICovXG4gIHRzU3ltYm9sOiB0cy5TeW1ib2x8bnVsbDtcblxuICAvKiogVGhlIHBvc2l0aW9uIG9mIHRoZSBtb3N0IHJlbGV2YW50IHBhcnQgb2YgdGhlIHRlbXBsYXRlIG5vZGUuICovXG4gIHNoaW1Mb2NhdGlvbjogU2hpbUxvY2F0aW9uO1xufVxuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgYW4gZXhwcmVzc2lvbiBpbiBhIGNvbXBvbmVudCB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFeHByZXNzaW9uU3ltYm9sIHtcbiAga2luZDogU3ltYm9sS2luZC5FeHByZXNzaW9uO1xuXG4gIC8qKiBUaGUgYHRzLlR5cGVgIG9mIHRoZSBleHByZXNzaW9uIEFTVC4gKi9cbiAgdHNUeXBlOiB0cy5UeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgYHRzLlN5bWJvbGAgb2YgdGhlIGVudGl0eS4gVGhpcyBjb3VsZCBiZSBgbnVsbGAsIGZvciBleGFtcGxlIGBBU1RgIGV4cHJlc3Npb25cbiAgICogYHt7Zm9vLmJhciArIGZvby5iYXp9fWAgZG9lcyBub3QgaGF2ZSBhIGB0cy5TeW1ib2xgIGJ1dCBgZm9vLmJhcmAgYW5kIGBmb28uYmF6YCBib3RoIGRvLlxuICAgKi9cbiAgdHNTeW1ib2w6IHRzLlN5bWJvbHxudWxsO1xuXG4gIC8qKiBUaGUgcG9zaXRpb24gb2YgdGhlIG1vc3QgcmVsZXZhbnQgcGFydCBvZiB0aGUgZXhwcmVzc2lvbi4gKi9cbiAgc2hpbUxvY2F0aW9uOiBTaGltTG9jYXRpb247XG59XG5cbi8qKiBSZXByZXNlbnRzIGVpdGhlciBhbiBpbnB1dCBvciBvdXRwdXQgYmluZGluZyBpbiBhIHRlbXBsYXRlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBCaW5kaW5nU3ltYm9sIHtcbiAga2luZDogU3ltYm9sS2luZC5CaW5kaW5nO1xuXG4gIC8qKiBUaGUgYHRzLlR5cGVgIG9mIHRoZSBjbGFzcyBtZW1iZXIgb24gdGhlIGRpcmVjdGl2ZSB0aGF0IGlzIHRoZSB0YXJnZXQgb2YgdGhlIGJpbmRpbmcuICovXG4gIHRzVHlwZTogdHMuVHlwZTtcblxuICAvKiogVGhlIGB0cy5TeW1ib2xgIG9mIHRoZSBjbGFzcyBtZW1iZXIgb24gdGhlIGRpcmVjdGl2ZSB0aGF0IGlzIHRoZSB0YXJnZXQgb2YgdGhlIGJpbmRpbmcuICovXG4gIHRzU3ltYm9sOiB0cy5TeW1ib2w7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0aXZlU3ltYm9sYCBvciBgRWxlbWVudFN5bWJvbGAgZm9yIHRoZSBEaXJlY3RpdmUsIENvbXBvbmVudCwgb3IgYEhUTUxFbGVtZW50YCB3aXRoXG4gICAqIHRoZSBiaW5kaW5nLlxuICAgKi9cbiAgdGFyZ2V0OiBEaXJlY3RpdmVTeW1ib2x8RWxlbWVudFN5bWJvbHxUZW1wbGF0ZVN5bWJvbDtcblxuICAvKiogVGhlIGxvY2F0aW9uIGluIHRoZSBzaGltIGZpbGUgd2hlcmUgdGhlIGZpZWxkIGFjY2VzcyBmb3IgdGhlIGJpbmRpbmcgYXBwZWFycy4gKi9cbiAgc2hpbUxvY2F0aW9uOiBTaGltTG9jYXRpb247XG59XG5cbi8qKlxuICogQSByZXByZXNlbnRhdGlvbiBvZiBhbiBpbnB1dCBiaW5kaW5nIGluIGEgY29tcG9uZW50IHRlbXBsYXRlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElucHV0QmluZGluZ1N5bWJvbCB7XG4gIGtpbmQ6IFN5bWJvbEtpbmQuSW5wdXQ7XG5cbiAgLyoqIEEgc2luZ2xlIGlucHV0IG1heSBiZSBib3VuZCB0byBtdWx0aXBsZSBjb21wb25lbnRzIG9yIGRpcmVjdGl2ZXMuICovXG4gIGJpbmRpbmdzOiBCaW5kaW5nU3ltYm9sW107XG59XG5cbi8qKlxuICogQSByZXByZXNlbnRhdGlvbiBvZiBhbiBvdXRwdXQgYmluZGluZyBpbiBhIGNvbXBvbmVudCB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPdXRwdXRCaW5kaW5nU3ltYm9sIHtcbiAga2luZDogU3ltYm9sS2luZC5PdXRwdXQ7XG5cbiAgLyoqIEEgc2luZ2xlIG91dHB1dCBtYXkgYmUgYm91bmQgdG8gbXVsdGlwbGUgY29tcG9uZW50cyBvciBkaXJlY3RpdmVzLiAqL1xuICBiaW5kaW5nczogQmluZGluZ1N5bWJvbFtdO1xufVxuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgYSBsb2NhbCByZWZlcmVuY2UgaW4gYSBjb21wb25lbnQgdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVmZXJlbmNlU3ltYm9sIHtcbiAga2luZDogU3ltYm9sS2luZC5SZWZlcmVuY2U7XG5cbiAgLyoqXG4gICAqIFRoZSBgdHMuVHlwZWAgb2YgdGhlIFJlZmVyZW5jZSB2YWx1ZS5cbiAgICpcbiAgICogYFRtcGxBc3RUZW1wbGF0ZWAgLSBUaGUgdHlwZSBvZiB0aGUgYFRlbXBsYXRlUmVmYFxuICAgKiBgVG1wbEFzdEVsZW1lbnRgIC0gVGhlIGB0cy5UeXBlYCBmb3IgdGhlIGBIVE1MRWxlbWVudGAuXG4gICAqIERpcmVjdGl2ZSAtIFRoZSBgdHMuVHlwZWAgZm9yIHRoZSBjbGFzcyBkZWNsYXJhdGlvbi5cbiAgICovXG4gIHRzVHlwZTogdHMuVHlwZTtcblxuICAvKipcbiAgICogVGhlIGB0cy5TeW1ib2xgIGZvciB0aGUgUmVmZXJlbmNlIHZhbHVlLlxuICAgKlxuICAgKiBgVG1wbEFzdFRlbXBsYXRlYCAtIEEgYFRlbXBsYXRlUmVmYCBzeW1ib2wuXG4gICAqIGBUbXBsQXN0RWxlbWVudGAgLSBUaGUgc3ltYm9sIGZvciB0aGUgYEhUTUxFbGVtZW50YC5cbiAgICogRGlyZWN0aXZlIC0gVGhlIHN5bWJvbCBmb3IgdGhlIGNsYXNzIGRlY2xhcmF0aW9uIG9mIHRoZSBkaXJlY3RpdmUuXG4gICAqL1xuICB0c1N5bWJvbDogdHMuU3ltYm9sO1xuXG4gIC8qKlxuICAgKiBEZXBlbmRpbmcgb24gdGhlIHR5cGUgb2YgdGhlIHJlZmVyZW5jZSwgdGhpcyBpcyBvbmUgb2YgdGhlIGZvbGxvd2luZzpcbiAgICogIC0gYFRtcGxBc3RFbGVtZW50YCB3aGVuIHRoZSBsb2NhbCByZWYgcmVmZXJzIHRvIHRoZSBIVE1MIGVsZW1lbnRcbiAgICogIC0gYFRtcGxBc3RUZW1wbGF0ZWAgd2hlbiB0aGUgcmVmIHJlZmVycyB0byBhbiBgbmctdGVtcGxhdGVgXG4gICAqICAtIGB0cy5DbGFzc0RlY2xhcmF0aW9uYCB3aGVuIHRoZSBsb2NhbCByZWYgcmVmZXJzIHRvIGEgRGlyZWN0aXZlIGluc3RhbmNlICgjcmVmPVwibXlFeHBvcnRBc1wiKVxuICAgKi9cbiAgdGFyZ2V0OiBUbXBsQXN0RWxlbWVudHxUbXBsQXN0VGVtcGxhdGV8dHMuQ2xhc3NEZWNsYXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIG5vZGUgaW4gdGhlIGBUZW1wbGF0ZUFzdGAgd2hlcmUgdGhlIHN5bWJvbCBpcyBkZWNsYXJlZC4gVGhhdCBpcywgbm9kZSBmb3IgdGhlIGAjcmVmYCBvclxuICAgKiBgI3JlZj1cImV4cG9ydEFzXCJgLlxuICAgKi9cbiAgZGVjbGFyYXRpb246IFRtcGxBc3RSZWZlcmVuY2U7XG5cbiAgLyoqIFRoZSBsb2NhdGlvbiBpbiB0aGUgc2hpbSBmaWxlIG9mIGEgdmFyaWFibGUgdGhhdCBob2xkcyB0aGUgdHlwZSBvZiB0aGUgbG9jYWwgcmVmLiAqL1xuICBzaGltTG9jYXRpb246IFNoaW1Mb2NhdGlvbjtcbn1cblxuLyoqXG4gKiBBIHJlcHJlc2VudGF0aW9uIG9mIGEgY29udGV4dCB2YXJpYWJsZSBpbiBhIGNvbXBvbmVudCB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWYXJpYWJsZVN5bWJvbCB7XG4gIGtpbmQ6IFN5bWJvbEtpbmQuVmFyaWFibGU7XG5cbiAgLyoqXG4gICAqIFRoZSBgdHMuVHlwZWAgb2YgdGhlIGVudGl0eS5cbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIGBhbnlgIGlmIHRoZXJlIGlzIG5vIGBuZ1RlbXBsYXRlQ29udGV4dEd1YXJkYC5cbiAgICovXG4gIHRzVHlwZTogdHMuVHlwZTtcblxuICAvKipcbiAgICogVGhlIGB0cy5TeW1ib2xgIGZvciB0aGUgY29udGV4dCB2YXJpYWJsZS5cbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIGBudWxsYCBpZiB0aGVyZSBpcyBubyBgbmdUZW1wbGF0ZUNvbnRleHRHdWFyZGAuXG4gICAqL1xuICB0c1N5bWJvbDogdHMuU3ltYm9sfG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBub2RlIGluIHRoZSBgVGVtcGxhdGVBc3RgIHdoZXJlIHRoZSB2YXJpYWJsZSBpcyBkZWNsYXJlZC4gVGhhdCBpcywgdGhlIG5vZGUgZm9yIHRoZSBgbGV0LWBcbiAgICogbm9kZSBpbiB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICBkZWNsYXJhdGlvbjogVG1wbEFzdFZhcmlhYmxlO1xuXG4gIC8qKiBUaGUgbG9jYXRpb24gaW4gdGhlIHNoaW0gZmlsZSBvZiBhIHZhcmlhYmxlIHRoYXQgaG9sZHMgdGhlIHR5cGUgb2YgdGhlIHRlbXBsYXRlIHZhcmlhYmxlLiAqL1xuICBzaGltTG9jYXRpb246IFNoaW1Mb2NhdGlvbjtcbn1cblxuLyoqXG4gKiBBIHJlcHJlc2VudGF0aW9uIG9mIGFuIGVsZW1lbnQgaW4gYSBjb21wb25lbnQgdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWxlbWVudFN5bWJvbCB7XG4gIGtpbmQ6IFN5bWJvbEtpbmQuRWxlbWVudDtcblxuICAvKiogVGhlIGB0cy5UeXBlYCBmb3IgdGhlIGBIVE1MRWxlbWVudGAuICovXG4gIHRzVHlwZTogdHMuVHlwZTtcblxuICAvKiogVGhlIGB0cy5TeW1ib2xgIGZvciB0aGUgYEhUTUxFbGVtZW50YC4gKi9cbiAgdHNTeW1ib2w6IHRzLlN5bWJvbHxudWxsO1xuXG4gIC8qKiBBIGxpc3Qgb2YgZGlyZWN0aXZlcyBhcHBsaWVkIHRvIHRoZSBlbGVtZW50LiAqL1xuICBkaXJlY3RpdmVzOiBEaXJlY3RpdmVTeW1ib2xbXTtcblxuICAvKiogVGhlIGxvY2F0aW9uIGluIHRoZSBzaGltIGZpbGUgZm9yIHRoZSB2YXJpYWJsZSB0aGF0IGhvbGRzIHRoZSB0eXBlIG9mIHRoZSBlbGVtZW50LiAqL1xuICBzaGltTG9jYXRpb246IFNoaW1Mb2NhdGlvbjtcblxuICB0ZW1wbGF0ZU5vZGU6IFRtcGxBc3RFbGVtZW50O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlU3ltYm9sIHtcbiAga2luZDogU3ltYm9sS2luZC5UZW1wbGF0ZTtcblxuICAvKiogQSBsaXN0IG9mIGRpcmVjdGl2ZXMgYXBwbGllZCB0byB0aGUgZWxlbWVudC4gKi9cbiAgZGlyZWN0aXZlczogRGlyZWN0aXZlU3ltYm9sW107XG5cbiAgdGVtcGxhdGVOb2RlOiBUbXBsQXN0VGVtcGxhdGU7XG59XG5cbi8qKlxuICogQSByZXByZXNlbnRhdGlvbiBvZiBhIGRpcmVjdGl2ZS9jb21wb25lbnQgd2hvc2Ugc2VsZWN0b3IgbWF0Y2hlcyBhIG5vZGUgaW4gYSBjb21wb25lbnRcbiAqIHRlbXBsYXRlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIERpcmVjdGl2ZVN5bWJvbCBleHRlbmRzIERpcmVjdGl2ZUluU2NvcGUge1xuICBraW5kOiBTeW1ib2xLaW5kLkRpcmVjdGl2ZTtcblxuICAvKiogVGhlIGB0cy5UeXBlYCBmb3IgdGhlIGNsYXNzIGRlY2xhcmF0aW9uLiAqL1xuICB0c1R5cGU6IHRzLlR5cGU7XG5cbiAgLyoqIFRoZSBsb2NhdGlvbiBpbiB0aGUgc2hpbSBmaWxlIGZvciB0aGUgdmFyaWFibGUgdGhhdCBob2xkcyB0aGUgdHlwZSBvZiB0aGUgZGlyZWN0aXZlLiAqL1xuICBzaGltTG9jYXRpb246IFNoaW1Mb2NhdGlvbjtcblxuICAvKiogVGhlIGBOZ01vZHVsZWAgdGhhdCB0aGlzIGRpcmVjdGl2ZSBpcyBkZWNsYXJlZCBpbiBvciBgbnVsbGAgaWYgaXQgY291bGQgbm90IGJlIGRldGVybWluZWQuICovXG4gIG5nTW9kdWxlOiBDbGFzc0RlY2xhcmF0aW9ufG51bGw7XG59XG5cbi8qKlxuICogQSByZXByZXNlbnRhdGlvbiBvZiBhbiBhdHRyaWJ1dGUgb24gYW4gZWxlbWVudCBvciB0ZW1wbGF0ZS4gVGhlc2UgYmluZGluZ3MgYXJlbid0IGN1cnJlbnRseVxuICogdHlwZS1jaGVja2VkIChzZWUgYGNoZWNrVHlwZU9mRG9tQmluZGluZ3NgKSBzbyB0aGV5IHdvbid0IGhhdmUgYSBgdHMuVHlwZWAsIGB0cy5TeW1ib2xgLCBvciBzaGltXG4gKiBsb2NhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEb21CaW5kaW5nU3ltYm9sIHtcbiAga2luZDogU3ltYm9sS2luZC5Eb21CaW5kaW5nO1xuXG4gIC8qKiBUaGUgc3ltYm9sIGZvciB0aGUgZWxlbWVudCBvciB0ZW1wbGF0ZSBvZiB0aGUgdGV4dCBhdHRyaWJ1dGUuICovXG4gIGhvc3Q6IEVsZW1lbnRTeW1ib2x8VGVtcGxhdGVTeW1ib2w7XG59XG4iXX0=