/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertNotEqual } from '../util/assert';
import { stringify } from '../util/stringify';
import { getInjectableDef } from './interface/defs';
import { InjectFlags } from './interface/injector';
/**
 * Current implementation of inject.
 *
 * By default, it is `injectInjectorOnly`, which makes it `Injector`-only aware. It can be changed
 * to `directiveInject`, which brings in the `NodeInjector` system of ivy. It is designed this
 * way for two reasons:
 *  1. `Injector` should not depend on ivy logic.
 *  2. To maintain tree shake-ability we don't want to bring in unnecessary code.
 */
let _injectImplementation;
export function getInjectImplementation() {
    return _injectImplementation;
}
/**
 * Sets the current inject implementation.
 */
export function setInjectImplementation(impl) {
    const previous = _injectImplementation;
    _injectImplementation = impl;
    return previous;
}
/**
 * Injects `root` tokens in limp mode.
 *
 * If no injector exists, we can still inject tree-shakable providers which have `providedIn` set to
 * `"root"`. This is known as the limp mode injection. In such case the value is stored in the
 * `InjectableDef`.
 */
export function injectRootLimpMode(token, notFoundValue, flags) {
    const injectableDef = getInjectableDef(token);
    if (injectableDef && injectableDef.providedIn == 'root') {
        return injectableDef.value === undefined ? injectableDef.value = injectableDef.factory() :
            injectableDef.value;
    }
    if (flags & InjectFlags.Optional)
        return null;
    if (notFoundValue !== undefined)
        return notFoundValue;
    throw new Error(`Injector: NOT_FOUND [${stringify(token)}]`);
}
/**
 * Assert that `_injectImplementation` is not `fn`.
 *
 * This is useful, to prevent infinite recursion.
 *
 * @param fn Function which it should not equal to
 */
export function assertInjectImplementationNotEqual(fn) {
    ngDevMode &&
        assertNotEqual(_injectImplementation, fn, 'Calling ɵɵinject would cause infinite recursion');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0X3N3aXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL2luamVjdF9zd2l0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUU1QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQWtCLE1BQU0sa0JBQWtCLENBQUM7QUFDbkUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR2pEOzs7Ozs7OztHQVFHO0FBQ0gsSUFBSSxxQkFDUyxDQUFDO0FBQ2QsTUFBTSxVQUFVLHVCQUF1QjtJQUNyQyxPQUFPLHFCQUFxQixDQUFDO0FBQy9CLENBQUM7QUFHRDs7R0FFRztBQUNILE1BQU0sVUFBVSx1QkFBdUIsQ0FDbkMsSUFDUztJQUNYLE1BQU0sUUFBUSxHQUFHLHFCQUFxQixDQUFDO0lBQ3ZDLHFCQUFxQixHQUFHLElBQUksQ0FBQztJQUM3QixPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBR0Q7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUM5QixLQUFnQyxFQUFFLGFBQTBCLEVBQUUsS0FBa0I7SUFDbEYsTUFBTSxhQUFhLEdBQTRCLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZFLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxVQUFVLElBQUksTUFBTSxFQUFFO1FBQ3ZELE9BQU8sYUFBYSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDL0MsYUFBYSxDQUFDLEtBQUssQ0FBQztLQUNoRTtJQUNELElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDOUMsSUFBSSxhQUFhLEtBQUssU0FBUztRQUFFLE9BQU8sYUFBYSxDQUFDO0lBQ3RELE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUdEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxrQ0FBa0MsQ0FDOUMsRUFBNEU7SUFDOUUsU0FBUztRQUNMLGNBQWMsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsaURBQWlELENBQUMsQ0FBQztBQUNuRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlL3R5cGUnO1xuaW1wb3J0IHthc3NlcnROb3RFcXVhbH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHtzdHJpbmdpZnl9IGZyb20gJy4uL3V0aWwvc3RyaW5naWZ5JztcbmltcG9ydCB7SW5qZWN0aW9uVG9rZW59IGZyb20gJy4vaW5qZWN0aW9uX3Rva2VuJztcbmltcG9ydCB7Z2V0SW5qZWN0YWJsZURlZiwgybXJtUluamVjdGFibGVEZWZ9IGZyb20gJy4vaW50ZXJmYWNlL2RlZnMnO1xuaW1wb3J0IHtJbmplY3RGbGFnc30gZnJvbSAnLi9pbnRlcmZhY2UvaW5qZWN0b3InO1xuXG5cbi8qKlxuICogQ3VycmVudCBpbXBsZW1lbnRhdGlvbiBvZiBpbmplY3QuXG4gKlxuICogQnkgZGVmYXVsdCwgaXQgaXMgYGluamVjdEluamVjdG9yT25seWAsIHdoaWNoIG1ha2VzIGl0IGBJbmplY3RvcmAtb25seSBhd2FyZS4gSXQgY2FuIGJlIGNoYW5nZWRcbiAqIHRvIGBkaXJlY3RpdmVJbmplY3RgLCB3aGljaCBicmluZ3MgaW4gdGhlIGBOb2RlSW5qZWN0b3JgIHN5c3RlbSBvZiBpdnkuIEl0IGlzIGRlc2lnbmVkIHRoaXNcbiAqIHdheSBmb3IgdHdvIHJlYXNvbnM6XG4gKiAgMS4gYEluamVjdG9yYCBzaG91bGQgbm90IGRlcGVuZCBvbiBpdnkgbG9naWMuXG4gKiAgMi4gVG8gbWFpbnRhaW4gdHJlZSBzaGFrZS1hYmlsaXR5IHdlIGRvbid0IHdhbnQgdG8gYnJpbmcgaW4gdW5uZWNlc3NhcnkgY29kZS5cbiAqL1xubGV0IF9pbmplY3RJbXBsZW1lbnRhdGlvbjogKDxUPih0b2tlbjogVHlwZTxUPnxJbmplY3Rpb25Ub2tlbjxUPiwgZmxhZ3M/OiBJbmplY3RGbGFncykgPT4gVCB8IG51bGwpfFxuICAgIHVuZGVmaW5lZDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmplY3RJbXBsZW1lbnRhdGlvbigpIHtcbiAgcmV0dXJuIF9pbmplY3RJbXBsZW1lbnRhdGlvbjtcbn1cblxuXG4vKipcbiAqIFNldHMgdGhlIGN1cnJlbnQgaW5qZWN0IGltcGxlbWVudGF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0SW5qZWN0SW1wbGVtZW50YXRpb24oXG4gICAgaW1wbDogKDxUPih0b2tlbjogVHlwZTxUPnxJbmplY3Rpb25Ub2tlbjxUPiwgZmxhZ3M/OiBJbmplY3RGbGFncykgPT4gVCB8IG51bGwpfFxuICAgIHVuZGVmaW5lZCk6ICg8VD4odG9rZW46IFR5cGU8VD58SW5qZWN0aW9uVG9rZW48VD4sIGZsYWdzPzogSW5qZWN0RmxhZ3MpID0+IFQgfCBudWxsKXx1bmRlZmluZWQge1xuICBjb25zdCBwcmV2aW91cyA9IF9pbmplY3RJbXBsZW1lbnRhdGlvbjtcbiAgX2luamVjdEltcGxlbWVudGF0aW9uID0gaW1wbDtcbiAgcmV0dXJuIHByZXZpb3VzO1xufVxuXG5cbi8qKlxuICogSW5qZWN0cyBgcm9vdGAgdG9rZW5zIGluIGxpbXAgbW9kZS5cbiAqXG4gKiBJZiBubyBpbmplY3RvciBleGlzdHMsIHdlIGNhbiBzdGlsbCBpbmplY3QgdHJlZS1zaGFrYWJsZSBwcm92aWRlcnMgd2hpY2ggaGF2ZSBgcHJvdmlkZWRJbmAgc2V0IHRvXG4gKiBgXCJyb290XCJgLiBUaGlzIGlzIGtub3duIGFzIHRoZSBsaW1wIG1vZGUgaW5qZWN0aW9uLiBJbiBzdWNoIGNhc2UgdGhlIHZhbHVlIGlzIHN0b3JlZCBpbiB0aGVcbiAqIGBJbmplY3RhYmxlRGVmYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdFJvb3RMaW1wTW9kZTxUPihcbiAgICB0b2tlbjogVHlwZTxUPnxJbmplY3Rpb25Ub2tlbjxUPiwgbm90Rm91bmRWYWx1ZTogVHx1bmRlZmluZWQsIGZsYWdzOiBJbmplY3RGbGFncyk6IFR8bnVsbCB7XG4gIGNvbnN0IGluamVjdGFibGVEZWY6IMm1ybVJbmplY3RhYmxlRGVmPFQ+fG51bGwgPSBnZXRJbmplY3RhYmxlRGVmKHRva2VuKTtcbiAgaWYgKGluamVjdGFibGVEZWYgJiYgaW5qZWN0YWJsZURlZi5wcm92aWRlZEluID09ICdyb290Jykge1xuICAgIHJldHVybiBpbmplY3RhYmxlRGVmLnZhbHVlID09PSB1bmRlZmluZWQgPyBpbmplY3RhYmxlRGVmLnZhbHVlID0gaW5qZWN0YWJsZURlZi5mYWN0b3J5KCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlRGVmLnZhbHVlO1xuICB9XG4gIGlmIChmbGFncyAmIEluamVjdEZsYWdzLk9wdGlvbmFsKSByZXR1cm4gbnVsbDtcbiAgaWYgKG5vdEZvdW5kVmFsdWUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIG5vdEZvdW5kVmFsdWU7XG4gIHRocm93IG5ldyBFcnJvcihgSW5qZWN0b3I6IE5PVF9GT1VORCBbJHtzdHJpbmdpZnkodG9rZW4pfV1gKTtcbn1cblxuXG4vKipcbiAqIEFzc2VydCB0aGF0IGBfaW5qZWN0SW1wbGVtZW50YXRpb25gIGlzIG5vdCBgZm5gLlxuICpcbiAqIFRoaXMgaXMgdXNlZnVsLCB0byBwcmV2ZW50IGluZmluaXRlIHJlY3Vyc2lvbi5cbiAqXG4gKiBAcGFyYW0gZm4gRnVuY3Rpb24gd2hpY2ggaXQgc2hvdWxkIG5vdCBlcXVhbCB0b1xuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0SW5qZWN0SW1wbGVtZW50YXRpb25Ob3RFcXVhbChcbiAgICBmbjogKDxUPih0b2tlbjogVHlwZTxUPnxJbmplY3Rpb25Ub2tlbjxUPiwgZmxhZ3M/OiBJbmplY3RGbGFncykgPT4gVCB8IG51bGwpKSB7XG4gIG5nRGV2TW9kZSAmJlxuICAgICAgYXNzZXJ0Tm90RXF1YWwoX2luamVjdEltcGxlbWVudGF0aW9uLCBmbiwgJ0NhbGxpbmcgybXJtWluamVjdCB3b3VsZCBjYXVzZSBpbmZpbml0ZSByZWN1cnNpb24nKTtcbn1cbiJdfQ==