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
        define("@angular/compiler-cli/src/transformers/api", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EmitFlags = exports.isNgDiagnostic = exports.isTsDiagnostic = exports.SOURCE = exports.UNKNOWN_ERROR_CODE = exports.DEFAULT_ERROR_CODE = void 0;
    exports.DEFAULT_ERROR_CODE = 100;
    exports.UNKNOWN_ERROR_CODE = 500;
    exports.SOURCE = 'angular';
    function isTsDiagnostic(diagnostic) {
        return diagnostic != null && diagnostic.source !== 'angular';
    }
    exports.isTsDiagnostic = isTsDiagnostic;
    function isNgDiagnostic(diagnostic) {
        return diagnostic != null && diagnostic.source === 'angular';
    }
    exports.isNgDiagnostic = isNgDiagnostic;
    var EmitFlags;
    (function (EmitFlags) {
        EmitFlags[EmitFlags["DTS"] = 1] = "DTS";
        EmitFlags[EmitFlags["JS"] = 2] = "JS";
        EmitFlags[EmitFlags["Metadata"] = 4] = "Metadata";
        EmitFlags[EmitFlags["I18nBundle"] = 8] = "I18nBundle";
        EmitFlags[EmitFlags["Codegen"] = 16] = "Codegen";
        EmitFlags[EmitFlags["Default"] = 19] = "Default";
        EmitFlags[EmitFlags["All"] = 31] = "All";
    })(EmitFlags = exports.EmitFlags || (exports.EmitFlags = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQU9VLFFBQUEsa0JBQWtCLEdBQUcsR0FBRyxDQUFDO0lBQ3pCLFFBQUEsa0JBQWtCLEdBQUcsR0FBRyxDQUFDO0lBQ3pCLFFBQUEsTUFBTSxHQUFHLFNBQXNCLENBQUM7SUFrQjdDLFNBQWdCLGNBQWMsQ0FBQyxVQUFlO1FBQzVDLE9BQU8sVUFBVSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQztJQUMvRCxDQUFDO0lBRkQsd0NBRUM7SUFFRCxTQUFnQixjQUFjLENBQUMsVUFBZTtRQUM1QyxPQUFPLFVBQVUsSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUM7SUFDL0QsQ0FBQztJQUZELHdDQUVDO0lBOEhELElBQVksU0FTWDtJQVRELFdBQVksU0FBUztRQUNuQix1Q0FBWSxDQUFBO1FBQ1oscUNBQVcsQ0FBQTtRQUNYLGlEQUFpQixDQUFBO1FBQ2pCLHFEQUFtQixDQUFBO1FBQ25CLGdEQUFnQixDQUFBO1FBRWhCLGdEQUE0QixDQUFBO1FBQzVCLHdDQUFnRCxDQUFBO0lBQ2xELENBQUMsRUFUVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQVNwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0dlbmVyYXRlZEZpbGUsIFBhcnNlU291cmNlU3BhbiwgUG9zaXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0V4dGVuZGVkVHNDb21waWxlckhvc3QsIE5nQ29tcGlsZXJPcHRpb25zfSBmcm9tICcuLi9uZ3RzYy9jb3JlL2FwaSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VSUk9SX0NPREUgPSAxMDA7XG5leHBvcnQgY29uc3QgVU5LTk9XTl9FUlJPUl9DT0RFID0gNTAwO1xuZXhwb3J0IGNvbnN0IFNPVVJDRSA9ICdhbmd1bGFyJyBhcyAnYW5ndWxhcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlhZ25vc3RpY01lc3NhZ2VDaGFpbiB7XG4gIG1lc3NhZ2VUZXh0OiBzdHJpbmc7XG4gIHBvc2l0aW9uPzogUG9zaXRpb247XG4gIG5leHQ/OiBEaWFnbm9zdGljTWVzc2FnZUNoYWluW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlhZ25vc3RpYyB7XG4gIG1lc3NhZ2VUZXh0OiBzdHJpbmc7XG4gIHNwYW4/OiBQYXJzZVNvdXJjZVNwYW47XG4gIHBvc2l0aW9uPzogUG9zaXRpb247XG4gIGNoYWluPzogRGlhZ25vc3RpY01lc3NhZ2VDaGFpbjtcbiAgY2F0ZWdvcnk6IHRzLkRpYWdub3N0aWNDYXRlZ29yeTtcbiAgY29kZTogbnVtYmVyO1xuICBzb3VyY2U6ICdhbmd1bGFyJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVHNEaWFnbm9zdGljKGRpYWdub3N0aWM6IGFueSk6IGRpYWdub3N0aWMgaXMgdHMuRGlhZ25vc3RpYyB7XG4gIHJldHVybiBkaWFnbm9zdGljICE9IG51bGwgJiYgZGlhZ25vc3RpYy5zb3VyY2UgIT09ICdhbmd1bGFyJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTmdEaWFnbm9zdGljKGRpYWdub3N0aWM6IGFueSk6IGRpYWdub3N0aWMgaXMgRGlhZ25vc3RpYyB7XG4gIHJldHVybiBkaWFnbm9zdGljICE9IG51bGwgJiYgZGlhZ25vc3RpYy5zb3VyY2UgPT09ICdhbmd1bGFyJztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21waWxlck9wdGlvbnMgZXh0ZW5kcyBOZ0NvbXBpbGVyT3B0aW9ucywgdHMuQ29tcGlsZXJPcHRpb25zIHtcbiAgLy8gTk9URTogVGhlc2UgY29tbWVudHMgYW5kIGFpby9jb250ZW50L2d1aWRlcy9hb3QtY29tcGlsZXIubWQgc2hvdWxkIGJlIGtlcHQgaW4gc3luYy5cblxuICAvLyBXcml0ZSBzdGF0aXN0aWNzIGFib3V0IGNvbXBpbGF0aW9uIChlLmcuIHRvdGFsIHRpbWUsIC4uLilcbiAgLy8gTm90ZTogdGhpcyBpcyB0aGUgLS1kaWFnbm9zdGljcyBjb21tYW5kIGxpbmUgb3B0aW9uIGZyb20gVFMgKHdoaWNoIGlzIEBpbnRlcm5hbFxuICAvLyBvbiB0cy5Db21waWxlck9wdGlvbnMgaW50ZXJmYWNlKS5cbiAgZGlhZ25vc3RpY3M/OiBib29sZWFuO1xuXG4gIC8vIEFic29sdXRlIHBhdGggdG8gYSBkaXJlY3Rvcnkgd2hlcmUgZ2VuZXJhdGVkIGZpbGUgc3RydWN0dXJlIGlzIHdyaXR0ZW4uXG4gIC8vIElmIHVuc3BlY2lmaWVkLCBnZW5lcmF0ZWQgZmlsZXMgd2lsbCBiZSB3cml0dGVuIGFsb25nc2lkZSBzb3VyY2VzLlxuICAvLyBAZGVwcmVjYXRlZCAtIG5vIGVmZmVjdFxuICBnZW5EaXI/OiBzdHJpbmc7XG5cbiAgLy8gUGF0aCB0byB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgdGhlIHRzY29uZmlnLmpzb24gZmlsZS5cbiAgYmFzZVBhdGg/OiBzdHJpbmc7XG5cbiAgLy8gRG9uJ3QgcHJvZHVjZSAubWV0YWRhdGEuanNvbiBmaWxlcyAodGhleSBkb24ndCB3b3JrIGZvciBidW5kbGVkIGVtaXQgd2l0aCAtLW91dClcbiAgc2tpcE1ldGFkYXRhRW1pdD86IGJvb2xlYW47XG5cbiAgLy8gUHJvZHVjZSBhbiBlcnJvciBpZiB0aGUgbWV0YWRhdGEgd3JpdHRlbiBmb3IgYSBjbGFzcyB3b3VsZCBwcm9kdWNlIGFuIGVycm9yIGlmIHVzZWQuXG4gIHN0cmljdE1ldGFkYXRhRW1pdD86IGJvb2xlYW47XG5cbiAgLy8gRG9uJ3QgcHJvZHVjZSAubmdmYWN0b3J5LmpzIG9yIC5uZ3N0eWxlLmpzIGZpbGVzXG4gIHNraXBUZW1wbGF0ZUNvZGVnZW4/OiBib29sZWFuO1xuXG4gIC8vIEEgcHJlZml4IHRvIGluc2VydCBpbiBnZW5lcmF0ZWQgcHJpdmF0ZSBzeW1ib2xzLCBlLmcuIGZvciBcIm15X3ByZWZpeF9cIiB3ZVxuICAvLyB3b3VsZCBnZW5lcmF0ZSBwcml2YXRlIHN5bWJvbHMgbmFtZWQgbGlrZSBgybVteV9wcmVmaXhfYWAuXG4gIGZsYXRNb2R1bGVQcml2YXRlU3ltYm9sUHJlZml4Pzogc3RyaW5nO1xuXG4gIC8vIFdoZXRoZXIgdG8gZ2VuZXJhdGUgY29kZSBmb3IgbGlicmFyeSBjb2RlLlxuICAvLyBJZiB0cnVlLCBwcm9kdWNlIC5uZ2ZhY3RvcnkudHMgYW5kIC5uZ3N0eWxlLnRzIGZpbGVzIGZvciAuZC50cyBpbnB1dHMuXG4gIC8vIERlZmF1bHQgaXMgdHJ1ZS5cbiAgZ2VuZXJhdGVDb2RlRm9yTGlicmFyaWVzPzogYm9vbGVhbjtcblxuICAvLyBNb2RpZnkgaG93IGFuZ3VsYXIgYW5ub3RhdGlvbnMgYXJlIGVtaXR0ZWQgdG8gaW1wcm92ZSB0cmVlLXNoYWtpbmcuXG4gIC8vIERlZmF1bHQgaXMgc3RhdGljIGZpZWxkcy5cbiAgLy8gZGVjb3JhdG9yczogTGVhdmUgdGhlIERlY29yYXRvcnMgaW4tcGxhY2UuIFRoaXMgbWFrZXMgY29tcGlsYXRpb24gZmFzdGVyLlxuICAvLyAgICAgICAgICAgICBUeXBlU2NyaXB0IHdpbGwgZW1pdCBjYWxscyB0byB0aGUgX19kZWNvcmF0ZSBoZWxwZXIuXG4gIC8vICAgICAgICAgICAgIGAtLWVtaXREZWNvcmF0b3JNZXRhZGF0YWAgY2FuIGJlIHVzZWQgZm9yIHJ1bnRpbWUgcmVmbGVjdGlvbi5cbiAgLy8gICAgICAgICAgICAgSG93ZXZlciwgdGhlIHJlc3VsdGluZyBjb2RlIHdpbGwgbm90IHByb3Blcmx5IHRyZWUtc2hha2UuXG4gIC8vIHN0YXRpYyBmaWVsZHM6IFJlcGxhY2UgZGVjb3JhdG9ycyB3aXRoIGEgc3RhdGljIGZpZWxkIGluIHRoZSBjbGFzcy5cbiAgLy8gICAgICAgICAgICAgICAgQWxsb3dzIGFkdmFuY2VkIHRyZWUtc2hha2VycyBsaWtlIENsb3N1cmUgQ29tcGlsZXIgdG8gcmVtb3ZlXG4gIC8vICAgICAgICAgICAgICAgIHVudXNlZCBjbGFzc2VzLlxuICBhbm5vdGF0aW9uc0FzPzogJ2RlY29yYXRvcnMnfCdzdGF0aWMgZmllbGRzJztcblxuICAvLyBQcmludCBleHRyYSBpbmZvcm1hdGlvbiB3aGlsZSBydW5uaW5nIHRoZSBjb21waWxlclxuICB0cmFjZT86IGJvb2xlYW47XG5cbiAgLy8gV2hldGhlciB0byBlbmFibGUgbG93ZXJpbmcgZXhwcmVzc2lvbnMgbGFtYmRhcyBhbmQgZXhwcmVzc2lvbnMgaW4gYSByZWZlcmVuY2UgdmFsdWVcbiAgLy8gcG9zaXRpb24uXG4gIGRpc2FibGVFeHByZXNzaW9uTG93ZXJpbmc/OiBib29sZWFuO1xuXG4gIC8vIExvY2FsZSBvZiB0aGUgYXBwbGljYXRpb25cbiAgaTE4bk91dExvY2FsZT86IHN0cmluZztcbiAgLy8gRXhwb3J0IGZvcm1hdCAoeGxmLCB4bGYyIG9yIHhtYilcbiAgaTE4bk91dEZvcm1hdD86IHN0cmluZztcbiAgLy8gUGF0aCB0byB0aGUgZXh0cmFjdGVkIG1lc3NhZ2UgZmlsZVxuICBpMThuT3V0RmlsZT86IHN0cmluZztcblxuICAvLyBJbXBvcnQgZm9ybWF0IGlmIGRpZmZlcmVudCBmcm9tIGBpMThuRm9ybWF0YFxuICBpMThuSW5Gb3JtYXQ/OiBzdHJpbmc7XG4gIC8vIFBhdGggdG8gdGhlIHRyYW5zbGF0aW9uIGZpbGVcbiAgaTE4bkluRmlsZT86IHN0cmluZztcbiAgLy8gSG93IHRvIGhhbmRsZSBtaXNzaW5nIG1lc3NhZ2VzXG4gIGkxOG5Jbk1pc3NpbmdUcmFuc2xhdGlvbnM/OiAnZXJyb3InfCd3YXJuaW5nJ3wnaWdub3JlJztcblxuICAvKipcbiAgICogV2hldGhlciB0byBnZW5lcmF0ZSAubmdzdW1tYXJ5LnRzIGZpbGVzIHRoYXQgYWxsb3cgdG8gdXNlIEFPVGVkIGFydGlmYWN0c1xuICAgKiBpbiBKSVQgbW9kZS4gVGhpcyBpcyBvZmYgYnkgZGVmYXVsdC5cbiAgICovXG4gIGVuYWJsZVN1bW1hcmllc0ZvckppdD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcmVwbGFjZSB0aGUgYHRlbXBsYXRlVXJsYCBhbmQgYHN0eWxlVXJsc2AgcHJvcGVydHkgaW4gYWxsXG4gICAqIEBDb21wb25lbnQgZGVjb3JhdG9ycyB3aXRoIGlubGluZWQgY29udGVudHMgaW4gYHRlbXBsYXRlYCBhbmQgYHN0eWxlc2BcbiAgICogcHJvcGVydGllcy5cbiAgICogV2hlbiBlbmFibGVkLCB0aGUgLmpzIG91dHB1dCBvZiBuZ2Mgd2lsbCBoYXZlIG5vIGxhenktbG9hZGVkIGB0ZW1wbGF0ZVVybGBcbiAgICogb3IgYHN0eWxlVXJsYHMuIE5vdGUgdGhhdCB0aGlzIHJlcXVpcmVzIHRoYXQgcmVzb3VyY2VzIGJlIGF2YWlsYWJsZSB0b1xuICAgKiBsb2FkIHN0YXRpY2FsbHkgYXQgY29tcGlsZS10aW1lLlxuICAgKi9cbiAgZW5hYmxlUmVzb3VyY2VJbmxpbmluZz86IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBjb2xsZWN0QWxsRXJyb3JzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciBOR0Mgc2hvdWxkIGdlbmVyYXRlIHJlLWV4cG9ydHMgZm9yIGV4dGVybmFsIHN5bWJvbHMgd2hpY2ggYXJlIHJlZmVyZW5jZWRcbiAgICogaW4gQW5ndWxhciBtZXRhZGF0YSAoZS5nLiBAQ29tcG9uZW50LCBASW5qZWN0LCBAVmlld0NoaWxkKS4gVGhpcyBjYW4gYmUgZW5hYmxlZCBpblxuICAgKiBvcmRlciB0byBhdm9pZCBkeW5hbWljYWxseSBnZW5lcmF0ZWQgbW9kdWxlIGRlcGVuZGVuY2llcyB3aGljaCBjYW4gYnJlYWsgc3RyaWN0XG4gICAqIGRlcGVuZGVuY3kgZW5mb3JjZW1lbnRzLiBUaGlzIGlzIG5vdCBlbmFibGVkIGJ5IGRlZmF1bHQuXG4gICAqIFJlYWQgbW9yZSBhYm91dCB0aGlzIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI1NjQ0LlxuICAgKi9cbiAgY3JlYXRlRXh0ZXJuYWxTeW1ib2xGYWN0b3J5UmVleHBvcnRzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21waWxlckhvc3QgZXh0ZW5kcyB0cy5Db21waWxlckhvc3QsIEV4dGVuZGVkVHNDb21waWxlckhvc3Qge1xuICAvKipcbiAgICogQ29udmVydHMgYSBtb2R1bGUgbmFtZSB0aGF0IGlzIHVzZWQgaW4gYW4gYGltcG9ydGAgdG8gYSBmaWxlIHBhdGguXG4gICAqIEkuZS4gYHBhdGgvdG8vY29udGFpbmluZ0ZpbGUudHNgIGNvbnRhaW5pbmcgYGltcG9ydCB7Li4ufSBmcm9tICdtb2R1bGUtbmFtZSdgLlxuICAgKi9cbiAgbW9kdWxlTmFtZVRvRmlsZU5hbWU/KG1vZHVsZU5hbWU6IHN0cmluZywgY29udGFpbmluZ0ZpbGU6IHN0cmluZyk6IHN0cmluZ3xudWxsO1xuICAvKipcbiAgICogQ29udmVydHMgYSBmaWxlIG5hbWUgaW50byBhIHJlcHJlc2VudGF0aW9uIHRoYXQgc2hvdWxkIGJlIHN0b3JlZCBpbiBhIHN1bW1hcnkgZmlsZS5cbiAgICogVGhpcyBoYXMgdG8gaW5jbHVkZSBjaGFuZ2luZyB0aGUgc3VmZml4IGFzIHdlbGwuXG4gICAqIEUuZy5cbiAgICogYHNvbWVfZmlsZS50c2AgLT4gYHNvbWVfZmlsZS5kLnRzYFxuICAgKlxuICAgKiBAcGFyYW0gcmVmZXJyaW5nU3JjRmlsZU5hbWUgdGhlIHNvdXJlIGZpbGUgdGhhdCByZWZlcnMgdG8gZmlsZU5hbWVcbiAgICovXG4gIHRvU3VtbWFyeUZpbGVOYW1lPyhmaWxlTmFtZTogc3RyaW5nLCByZWZlcnJpbmdTcmNGaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nO1xuICAvKipcbiAgICogQ29udmVydHMgYSBmaWxlTmFtZSB0aGF0IHdhcyBwcm9jZXNzZWQgYnkgYHRvU3VtbWFyeUZpbGVOYW1lYCBiYWNrIGludG8gYSByZWFsIGZpbGVOYW1lXG4gICAqIGdpdmVuIHRoZSBmaWxlTmFtZSBvZiB0aGUgbGlicmFyeSB0aGF0IGlzIHJlZmVycmlnIHRvIGl0LlxuICAgKi9cbiAgZnJvbVN1bW1hcnlGaWxlTmFtZT8oZmlsZU5hbWU6IHN0cmluZywgcmVmZXJyaW5nTGliRmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZztcbiAgLyoqXG4gICAqIFByb2R1Y2UgYW4gQU1EIG1vZHVsZSBuYW1lIGZvciB0aGUgc291cmNlIGZpbGUuIFVzZWQgaW4gQmF6ZWwuXG4gICAqXG4gICAqIEFuIEFNRCBtb2R1bGUgY2FuIGhhdmUgYW4gYXJiaXRyYXJ5IG5hbWUsIHNvIHRoYXQgaXQgaXMgcmVxdWlyZSdkIGJ5IG5hbWVcbiAgICogcmF0aGVyIHRoYW4gYnkgcGF0aC4gU2VlIGh0dHBzOi8vcmVxdWlyZWpzLm9yZy9kb2NzL3doeWFtZC5odG1sI25hbWVkbW9kdWxlc1xuICAgKi9cbiAgYW1kTW9kdWxlTmFtZT8oc2Y6IHRzLlNvdXJjZUZpbGUpOiBzdHJpbmd8dW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZW51bSBFbWl0RmxhZ3Mge1xuICBEVFMgPSAxIDw8IDAsXG4gIEpTID0gMSA8PCAxLFxuICBNZXRhZGF0YSA9IDEgPDwgMixcbiAgSTE4bkJ1bmRsZSA9IDEgPDwgMyxcbiAgQ29kZWdlbiA9IDEgPDwgNCxcblxuICBEZWZhdWx0ID0gRFRTIHwgSlMgfCBDb2RlZ2VuLFxuICBBbGwgPSBEVFMgfCBKUyB8IE1ldGFkYXRhIHwgSTE4bkJ1bmRsZSB8IENvZGVnZW4sXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tVHJhbnNmb3JtZXJzIHtcbiAgYmVmb3JlVHM/OiB0cy5UcmFuc2Zvcm1lckZhY3Rvcnk8dHMuU291cmNlRmlsZT5bXTtcbiAgYWZ0ZXJUcz86IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRzRW1pdEFyZ3VtZW50cyB7XG4gIHByb2dyYW06IHRzLlByb2dyYW07XG4gIGhvc3Q6IENvbXBpbGVySG9zdDtcbiAgb3B0aW9uczogQ29tcGlsZXJPcHRpb25zO1xuICB0YXJnZXRTb3VyY2VGaWxlPzogdHMuU291cmNlRmlsZTtcbiAgd3JpdGVGaWxlPzogdHMuV3JpdGVGaWxlQ2FsbGJhY2s7XG4gIGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW47XG4gIGVtaXRPbmx5RHRzRmlsZXM/OiBib29sZWFuO1xuICBjdXN0b21UcmFuc2Zvcm1lcnM/OiB0cy5DdXN0b21UcmFuc2Zvcm1lcnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHNFbWl0Q2FsbGJhY2sge1xuICAoYXJnczogVHNFbWl0QXJndW1lbnRzKTogdHMuRW1pdFJlc3VsdDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgVHNNZXJnZUVtaXRSZXN1bHRzQ2FsbGJhY2sge1xuICAocmVzdWx0czogdHMuRW1pdFJlc3VsdFtdKTogdHMuRW1pdFJlc3VsdDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWJyYXJ5U3VtbWFyeSB7XG4gIGZpbGVOYW1lOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbiAgc291cmNlRmlsZT86IHRzLlNvdXJjZUZpbGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGF6eVJvdXRlIHtcbiAgcm91dGU6IHN0cmluZztcbiAgbW9kdWxlOiB7bmFtZTogc3RyaW5nLCBmaWxlUGF0aDogc3RyaW5nfTtcbiAgcmVmZXJlbmNlZE1vZHVsZToge25hbWU6IHN0cmluZywgZmlsZVBhdGg6IHN0cmluZ307XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvZ3JhbSB7XG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgVHlwZVNjcmlwdCBwcm9ncmFtIHVzZWQgdG8gcHJvZHVjZSBzZW1hbnRpYyBkaWFnbm9zdGljcyBhbmQgZW1pdCB0aGUgc291cmNlcy5cbiAgICpcbiAgICogQW5ndWxhciBzdHJ1Y3R1cmFsIGluZm9ybWF0aW9uIGlzIHJlcXVpcmVkIHRvIHByb2R1Y2UgdGhlIHByb2dyYW0uXG4gICAqL1xuICBnZXRUc1Byb2dyYW0oKTogdHMuUHJvZ3JhbTtcblxuICAvKipcbiAgICogUmV0cmlldmUgb3B0aW9ucyBkaWFnbm9zdGljcyBmb3IgdGhlIFR5cGVTY3JpcHQgb3B0aW9ucyB1c2VkIHRvIGNyZWF0ZSB0aGUgcHJvZ3JhbS4gVGhpcyBpc1xuICAgKiBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBnZXRUc1Byb2dyYW0oKS5nZXRPcHRpb25zRGlhZ25vc3RpY3MoKWAgc2luY2UgaXQgZG9lcyBub3QgbmVlZCB0b1xuICAgKiBjb2xsZWN0IEFuZ3VsYXIgc3RydWN0dXJhbCBpbmZvcm1hdGlvbiB0byBwcm9kdWNlIHRoZSBlcnJvcnMuXG4gICAqL1xuICBnZXRUc09wdGlvbkRpYWdub3N0aWNzKGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW4pOiBSZWFkb25seUFycmF5PHRzLkRpYWdub3N0aWM+O1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBvcHRpb25zIGRpYWdub3N0aWNzIGZvciB0aGUgQW5ndWxhciBvcHRpb25zIHVzZWQgdG8gY3JlYXRlIHRoZSBwcm9ncmFtLlxuICAgKi9cbiAgZ2V0TmdPcHRpb25EaWFnbm9zdGljcyhjYW5jZWxsYXRpb25Ub2tlbj86IHRzLkNhbmNlbGxhdGlvblRva2VuKTpcbiAgICAgIFJlYWRvbmx5QXJyYXk8dHMuRGlhZ25vc3RpY3xEaWFnbm9zdGljPjtcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIHN5bnRheCBkaWFnbm9zdGljcyBmcm9tIFR5cGVTY3JpcHQuIFRoaXMgaXMgZmFzdGVyIHRoYW4gY2FsbGluZ1xuICAgKiBgZ2V0VHNQcm9ncmFtKCkuZ2V0U3ludGFjdGljRGlhZ25vc3RpY3MoKWAgc2luY2UgaXQgZG9lcyBub3QgbmVlZCB0byBjb2xsZWN0IEFuZ3VsYXIgc3RydWN0dXJhbFxuICAgKiBpbmZvcm1hdGlvbiB0byBwcm9kdWNlIHRoZSBlcnJvcnMuXG4gICAqL1xuICBnZXRUc1N5bnRhY3RpY0RpYWdub3N0aWNzKHNvdXJjZUZpbGU/OiB0cy5Tb3VyY2VGaWxlLCBjYW5jZWxsYXRpb25Ub2tlbj86IHRzLkNhbmNlbGxhdGlvblRva2VuKTpcbiAgICAgIFJlYWRvbmx5QXJyYXk8dHMuRGlhZ25vc3RpYz47XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBkaWFnbm9zdGljcyBmb3IgdGhlIHN0cnVjdHVyZSBvZiBhbiBBbmd1bGFyIGFwcGxpY2F0aW9uIGlzIGNvcnJlY3RseSBmb3JtZWQuXG4gICAqIFRoaXMgaW5jbHVkZXMgdmFsaWRhdGluZyBBbmd1bGFyIGFubm90YXRpb25zIGFuZCB0aGUgc3ludGF4IG9mIHJlZmVyZW5jZWQgYW5kIGltYmVkZGVkIEhUTUxcbiAgICogYW5kIENTUy5cbiAgICpcbiAgICogTm90ZSBpdCBpcyBpbXBvcnRhbnQgdG8gZGlzcGxheWluZyBUeXBlU2NyaXB0IHNlbWFudGljIGRpYWdub3N0aWNzIGFsb25nIHdpdGggQW5ndWxhclxuICAgKiBzdHJ1Y3R1cmFsIGRpYWdub3N0aWNzIGFzIGFuIGVycm9yIGluIHRoZSBwcm9ncmFtIHN0cnVjdHVyZSBtaWdodCBjYXVzZSBlcnJvcnMgZGV0ZWN0ZWQgaW5cbiAgICogc2VtYW50aWMgYW5hbHlzaXMgYW5kIGEgc2VtYW50aWMgZXJyb3IgbWlnaHQgY2F1c2UgZXJyb3JzIGluIHNwZWNpZnlpbmcgdGhlIHByb2dyYW0gc3RydWN0dXJlLlxuICAgKlxuICAgKiBBbmd1bGFyIHN0cnVjdHVyYWwgaW5mb3JtYXRpb24gaXMgcmVxdWlyZWQgdG8gcHJvZHVjZSB0aGVzZSBkaWFnbm9zdGljcy5cbiAgICovXG4gIGdldE5nU3RydWN0dXJhbERpYWdub3N0aWNzKGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW4pOiBSZWFkb25seUFycmF5PERpYWdub3N0aWM+O1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgc2VtYW50aWMgZGlhZ25vc3RpY3MgZnJvbSBUeXBlU2NyaXB0LiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gY2FsbGluZ1xuICAgKiBgZ2V0VHNQcm9ncmFtKCkuZ2V0U2VtYW50aWNEaWFnbm9zdGljcygpYCBkaXJlY3RseSBhbmQgaXMgaW5jbHVkZWQgZm9yIGNvbXBsZXRlbmVzcy5cbiAgICovXG4gIGdldFRzU2VtYW50aWNEaWFnbm9zdGljcyhzb3VyY2VGaWxlPzogdHMuU291cmNlRmlsZSwgY2FuY2VsbGF0aW9uVG9rZW4/OiB0cy5DYW5jZWxsYXRpb25Ub2tlbik6XG4gICAgICBSZWFkb25seUFycmF5PHRzLkRpYWdub3N0aWM+O1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgQW5ndWxhciBzZW1hbnRpYyBkaWFnbm9zdGljcy5cbiAgICpcbiAgICogQW5ndWxhciBzdHJ1Y3R1cmFsIGluZm9ybWF0aW9uIGlzIHJlcXVpcmVkIHRvIHByb2R1Y2UgdGhlc2UgZGlhZ25vc3RpY3MuXG4gICAqL1xuICBnZXROZ1NlbWFudGljRGlhZ25vc3RpY3MoZmlsZU5hbWU/OiBzdHJpbmcsIGNhbmNlbGxhdGlvblRva2VuPzogdHMuQ2FuY2VsbGF0aW9uVG9rZW4pOlxuICAgICAgUmVhZG9ubHlBcnJheTx0cy5EaWFnbm9zdGljfERpYWdub3N0aWM+O1xuXG4gIC8qKlxuICAgKiBMb2FkIEFuZ3VsYXIgc3RydWN0dXJhbCBpbmZvcm1hdGlvbiBhc3luY2hyb25vdXNseS4gSWYgdGhpcyBtZXRob2QgaXMgbm90IGNhbGxlZCB0aGVuIHRoZVxuICAgKiBBbmd1bGFyIHN0cnVjdHVyYWwgaW5mb3JtYXRpb24sIGluY2x1ZGluZyByZWZlcmVuY2VkIEhUTUwgYW5kIENTUyBmaWxlcywgYXJlIGxvYWRlZFxuICAgKiBzeW5jaHJvbm91c2x5LiBJZiB0aGUgc3VwcGxpZWQgQW5ndWxhciBjb21waWxlciBob3N0IHJldHVybnMgYSBwcm9taXNlIGZyb20gYGxvYWRSZXNvdXJjZSgpYFxuICAgKiB3aWxsIHByb2R1Y2UgYSBkaWFnbm9zdGljIGVycm9yIG1lc3NhZ2Ugb3IsIGBnZXRUc1Byb2dyYW0oKWAgb3IgYGVtaXRgIHRvIHRocm93LlxuICAgKi9cbiAgbG9hZE5nU3RydWN0dXJlQXN5bmMoKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGF6eSByb3V0ZXMgaW4gdGhlIHByb2dyYW0uXG4gICAqIEBwYXJhbSBlbnRyeVJvdXRlIEEgcmVmZXJlbmNlIHRvIGFuIE5nTW9kdWxlIGxpa2UgYHNvbWVNb2R1bGUjbmFtZWAuIElmIGdpdmVuLFxuICAgKiAgICAgICAgICAgICAgd2lsbCByZWN1cnNpdmVseSBhbmFseXplIHJvdXRlcyBzdGFydGluZyBmcm9tIHRoaXMgc3ltYm9sIG9ubHkuXG4gICAqICAgICAgICAgICAgICBPdGhlcndpc2Ugd2lsbCBsaXN0IGFsbCByb3V0ZXMgZm9yIGFsbCBOZ01vZHVsZXMgaW4gdGhlIHByb2dyYW0vXG4gICAqL1xuICBsaXN0TGF6eVJvdXRlcyhlbnRyeVJvdXRlPzogc3RyaW5nKTogTGF6eVJvdXRlW107XG5cbiAgLyoqXG4gICAqIEVtaXQgdGhlIGZpbGVzIHJlcXVlc3RlZCBieSBlbWl0RmxhZ3MgaW1wbGllZCBieSB0aGUgcHJvZ3JhbS5cbiAgICpcbiAgICogQW5ndWxhciBzdHJ1Y3R1cmFsIGluZm9ybWF0aW9uIGlzIHJlcXVpcmVkIHRvIGVtaXQgZmlsZXMuXG4gICAqL1xuICBlbWl0KHtlbWl0RmxhZ3MsIGNhbmNlbGxhdGlvblRva2VuLCBjdXN0b21UcmFuc2Zvcm1lcnMsIGVtaXRDYWxsYmFjaywgbWVyZ2VFbWl0UmVzdWx0c0NhbGxiYWNrfT86XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBlbWl0RmxhZ3M/OiBFbWl0RmxhZ3MsXG4gICAgICAgICAgICAgY2FuY2VsbGF0aW9uVG9rZW4/OiB0cy5DYW5jZWxsYXRpb25Ub2tlbixcbiAgICAgICAgICAgICBjdXN0b21UcmFuc2Zvcm1lcnM/OiBDdXN0b21UcmFuc2Zvcm1lcnMsXG4gICAgICAgICAgICAgZW1pdENhbGxiYWNrPzogVHNFbWl0Q2FsbGJhY2ssXG4gICAgICAgICAgICAgbWVyZ2VFbWl0UmVzdWx0c0NhbGxiYWNrPzogVHNNZXJnZUVtaXRSZXN1bHRzQ2FsbGJhY2tcbiAgICAgICAgICAgfSk6IHRzLkVtaXRSZXN1bHQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIC5kLnRzIC8gLm5nc3VtbWFyeS5qc29uIC8gLm5nZmFjdG9yeS5kLnRzIGZpbGVzIG9mIGxpYnJhcmllcyB0aGF0IGhhdmUgYmVlbiBlbWl0dGVkXG4gICAqIGluIHRoaXMgcHJvZ3JhbSBvciBwcmV2aW91cyBwcm9ncmFtcyB3aXRoIHBhdGhzIHRoYXQgZW11bGF0ZSB0aGUgZmFjdCB0aGF0IHRoZXNlIGxpYnJhcmllc1xuICAgKiBoYXZlIGJlZW4gY29tcGlsZWQgYmVmb3JlIHdpdGggbm8gb3V0RGlyLlxuICAgKi9cbiAgZ2V0TGlicmFyeVN1bW1hcmllcygpOiBNYXA8c3RyaW5nLCBMaWJyYXJ5U3VtbWFyeT47XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZ2V0RW1pdHRlZEdlbmVyYXRlZEZpbGVzKCk6IE1hcDxzdHJpbmcsIEdlbmVyYXRlZEZpbGU+O1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGdldEVtaXR0ZWRTb3VyY2VGaWxlcygpOiBNYXA8c3RyaW5nLCB0cy5Tb3VyY2VGaWxlPjtcbn1cbiJdfQ==