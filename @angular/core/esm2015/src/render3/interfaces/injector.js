/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertDefined, assertEqual } from '../../util/assert';
export const NO_PARENT_INJECTOR = -1;
/**
 * Each injector is saved in 9 contiguous slots in `LView` and 9 contiguous slots in
 * `TView.data`. This allows us to store information about the current node's tokens (which
 * can be shared in `TView`) as well as the tokens of its ancestor nodes (which cannot be
 * shared, so they live in `LView`).
 *
 * Each of these slots (aside from the last slot) contains a bloom filter. This bloom filter
 * determines whether a directive is available on the associated node or not. This prevents us
 * from searching the directives array at this level unless it's probable the directive is in it.
 *
 * See: https://en.wikipedia.org/wiki/Bloom_filter for more about bloom filters.
 *
 * Because all injectors have been flattened into `LView` and `TViewData`, they cannot typed
 * using interfaces as they were previously. The start index of each `LInjector` and `TInjector`
 * will differ based on where it is flattened into the main array, so it's not possible to know
 * the indices ahead of time and save their types here. The interfaces are still included here
 * for documentation purposes.
 *
 * export interface LInjector extends Array<any> {
 *
 *    // Cumulative bloom for directive IDs 0-31  (IDs are % BLOOM_SIZE)
 *    [0]: number;
 *
 *    // Cumulative bloom for directive IDs 32-63
 *    [1]: number;
 *
 *    // Cumulative bloom for directive IDs 64-95
 *    [2]: number;
 *
 *    // Cumulative bloom for directive IDs 96-127
 *    [3]: number;
 *
 *    // Cumulative bloom for directive IDs 128-159
 *    [4]: number;
 *
 *    // Cumulative bloom for directive IDs 160 - 191
 *    [5]: number;
 *
 *    // Cumulative bloom for directive IDs 192 - 223
 *    [6]: number;
 *
 *    // Cumulative bloom for directive IDs 224 - 255
 *    [7]: number;
 *
 *    // We need to store a reference to the injector's parent so DI can keep looking up
 *    // the injector tree until it finds the dependency it's looking for.
 *    [PARENT_INJECTOR]: number;
 * }
 *
 * export interface TInjector extends Array<any> {
 *
 *    // Shared node bloom for directive IDs 0-31  (IDs are % BLOOM_SIZE)
 *    [0]: number;
 *
 *    // Shared node bloom for directive IDs 32-63
 *    [1]: number;
 *
 *    // Shared node bloom for directive IDs 64-95
 *    [2]: number;
 *
 *    // Shared node bloom for directive IDs 96-127
 *    [3]: number;
 *
 *    // Shared node bloom for directive IDs 128-159
 *    [4]: number;
 *
 *    // Shared node bloom for directive IDs 160 - 191
 *    [5]: number;
 *
 *    // Shared node bloom for directive IDs 192 - 223
 *    [6]: number;
 *
 *    // Shared node bloom for directive IDs 224 - 255
 *    [7]: number;
 *
 *    // Necessary to find directive indices for a particular node.
 *    [TNODE]: TElementNode|TElementContainerNode|TContainerNode;
 *  }
 */
/**
 * Factory for creating instances of injectors in the NodeInjector.
 *
 * This factory is complicated by the fact that it can resolve `multi` factories as well.
 *
 * NOTE: Some of the fields are optional which means that this class has two hidden classes.
 * - One without `multi` support (most common)
 * - One with `multi` values, (rare).
 *
 * Since VMs can cache up to 4 inline hidden classes this is OK.
 *
 * - Single factory: Only `resolving` and `factory` is defined.
 * - `providers` factory: `componentProviders` is a number and `index = -1`.
 * - `viewProviders` factory: `componentProviders` is a number and `index` points to `providers`.
 */
export class NodeInjectorFactory {
    constructor(
    /**
     * Factory to invoke in order to create a new instance.
     */
    factory, 
    /**
     * Set to `true` if the token is declared in `viewProviders` (or if it is component).
     */
    isViewProvider, injectImplementation) {
        this.factory = factory;
        /**
         * Marker set to true during factory invocation to see if we get into recursive loop.
         * Recursive loop causes an error to be displayed.
         */
        this.resolving = false;
        ngDevMode && assertDefined(factory, 'Factory not specified');
        ngDevMode && assertEqual(typeof factory, 'function', 'Expected factory function.');
        this.canSeeViewProviders = isViewProvider;
        this.injectImpl = injectImplementation;
    }
}
export function isFactory(obj) {
    return obj instanceof NodeInjectorFactory;
}
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
export const unusedValueExportToPlacateAjd = 1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ludGVyZmFjZXMvaW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBS0gsT0FBTyxFQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQWtFN0QsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQTZCLENBQUMsQ0FBUSxDQUFDO0FBRXRFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4RUc7QUFFSDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQU0sT0FBTyxtQkFBbUI7SUFtRjlCO0lBQ0k7O09BRUc7SUFDSSxPQWUrQjtJQUN0Qzs7T0FFRztJQUNILGNBQXVCLEVBQ3ZCLG9CQUNpRTtRQXJCMUQsWUFBTyxHQUFQLE9BQU8sQ0Fld0I7UUFoRzFDOzs7V0FHRztRQUNILGNBQVMsR0FBRyxLQUFLLENBQUM7UUFtR2hCLFNBQVMsSUFBSSxhQUFhLENBQUMsT0FBTyxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDN0QsU0FBUyxJQUFJLFdBQVcsQ0FBQyxPQUFPLE9BQU8sRUFBRSxVQUFVLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsY0FBYyxDQUFDO1FBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFDekMsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FBQyxHQUFRO0lBQ2hDLE9BQU8sR0FBRyxZQUFZLG1CQUFtQixDQUFDO0FBQzVDLENBQUM7QUFFRCxpRkFBaUY7QUFDakYsMEJBQTBCO0FBQzFCLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGlvblRva2VufSBmcm9tICcuLi8uLi9kaS9pbmplY3Rpb25fdG9rZW4nO1xuaW1wb3J0IHtJbmplY3RGbGFnc30gZnJvbSAnLi4vLi4vZGkvaW50ZXJmYWNlL2luamVjdG9yJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlL3R5cGUnO1xuaW1wb3J0IHthc3NlcnREZWZpbmVkLCBhc3NlcnRFcXVhbH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuXG5pbXBvcnQge1REaXJlY3RpdmVIb3N0Tm9kZX0gZnJvbSAnLi9ub2RlJztcbmltcG9ydCB7TFZpZXcsIFREYXRhfSBmcm9tICcuL3ZpZXcnO1xuXG4vKipcbiAqIE9mZnNldHMgb2YgdGhlIGBOb2RlSW5qZWN0b3JgIGRhdGEgc3RydWN0dXJlIGluIHRoZSBleHBhbmRvLlxuICpcbiAqIGBOb2RlSW5qZWN0b3JgIGlzIHN0b3JlZCBpbiBib3RoIGBMVmlld2AgYXMgd2VsbCBhcyBgVFZpZXcuZGF0YWAuIEFsbCBzdG9yYWdlIHJlcXVpcmVzIDkgd29yZHMuXG4gKiBGaXJzdCA4IGFyZSByZXNlcnZlZCBmb3IgYmxvb20gZmlsdGVyIGFuZCB0aGUgOXRoIGlzIHJlc2VydmVkIGZvciB0aGUgYXNzb2NpYXRlZCBgVE5vZGVgIGFzIHdlbGxcbiAqIGFzIHBhcmVudCBgTm9kZUluamVjdG9yYCBwb2ludGVyLiBBbGwgaW5kZXhlcyBhcmUgc3RhcnRpbmcgd2l0aCBgaW5kZXhgIGFuZCBoYXZlIGFuIG9mZnNldCBhc1xuICogc2hvd24uXG4gKlxuICogYExWaWV3YCBsYXlvdXQ6XG4gKiBgYGBcbiAqIGluZGV4ICsgMDogY3VtdWxhdGl2ZSBibG9vbSBmaWx0ZXJcbiAqIGluZGV4ICsgMTogY3VtdWxhdGl2ZSBibG9vbSBmaWx0ZXJcbiAqIGluZGV4ICsgMjogY3VtdWxhdGl2ZSBibG9vbSBmaWx0ZXJcbiAqIGluZGV4ICsgMzogY3VtdWxhdGl2ZSBibG9vbSBmaWx0ZXJcbiAqIGluZGV4ICsgNDogY3VtdWxhdGl2ZSBibG9vbSBmaWx0ZXJcbiAqIGluZGV4ICsgNTogY3VtdWxhdGl2ZSBibG9vbSBmaWx0ZXJcbiAqIGluZGV4ICsgNjogY3VtdWxhdGl2ZSBibG9vbSBmaWx0ZXJcbiAqIGluZGV4ICsgNzogY3VtdWxhdGl2ZSBibG9vbSBmaWx0ZXJcbiAqIGluZGV4ICsgODogY3VtdWxhdGl2ZSBibG9vbSBmaWx0ZXJcbiAqIGluZGV4ICsgUEFSRU5UOiBJbmRleCB0byB0aGUgcGFyZW50IGluamVjdG9yLiBTZWUgYFJlbGF0aXZlSW5qZWN0b3JMb2NhdGlvbmBcbiAqICAgICAgICAgICAgICAgICBgY29uc3QgcGFyZW50ID0gbFZpZXdbaW5kZXggKyBOb2RlSW5qZWN0b3JPZmZzZXQuUEFSRU5UXWBcbiAqIGBgYFxuICpcbiAqIGBUVmlld0RhdGFgIGxheW91dDpcbiAqIGBgYFxuICogaW5kZXggKyAwOiBjdW11bGF0aXZlIGJsb29tIGZpbHRlclxuICogaW5kZXggKyAxOiBjdW11bGF0aXZlIGJsb29tIGZpbHRlclxuICogaW5kZXggKyAyOiBjdW11bGF0aXZlIGJsb29tIGZpbHRlclxuICogaW5kZXggKyAzOiBjdW11bGF0aXZlIGJsb29tIGZpbHRlclxuICogaW5kZXggKyA0OiBjdW11bGF0aXZlIGJsb29tIGZpbHRlclxuICogaW5kZXggKyA1OiBjdW11bGF0aXZlIGJsb29tIGZpbHRlclxuICogaW5kZXggKyA2OiBjdW11bGF0aXZlIGJsb29tIGZpbHRlclxuICogaW5kZXggKyA3OiBjdW11bGF0aXZlIGJsb29tIGZpbHRlclxuICogaW5kZXggKyA4OiBjdW11bGF0aXZlIGJsb29tIGZpbHRlclxuICogaW5kZXggKyBUTk9ERTogVE5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYE5vZGVJbmplY3RvcmBcbiAqICAgICAgICAgICAgICAgIGBjYW5zdCB0Tm9kZSA9IHRWaWV3LmRhdGFbaW5kZXggKyBOb2RlSW5qZWN0b3JPZmZzZXQuVE5PREVdYFxuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIE5vZGVJbmplY3Rvck9mZnNldCB7XG4gIFROT0RFID0gOCxcbiAgUEFSRU5UID0gOCxcbiAgQkxPT01fU0laRSA9IDgsXG4gIFNJWkUgPSA5LFxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSByZWxhdGl2ZSBsb2NhdGlvbiBvZiBwYXJlbnQgaW5qZWN0b3IuXG4gKlxuICogVGhlIGludGVyZmFjZXMgZW5jb2RlcyBudW1iZXIgb2YgcGFyZW50cyBgTFZpZXdgcyB0byB0cmF2ZXJzZSBhbmQgaW5kZXggaW4gdGhlIGBMVmlld2BcbiAqIHBvaW50aW5nIHRvIHRoZSBwYXJlbnQgaW5qZWN0b3IuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVsYXRpdmVJbmplY3RvckxvY2F0aW9uIHtcbiAgX19icmFuZF9fOiAnUmVsYXRpdmVJbmplY3RvckxvY2F0aW9uRmxhZ3MnO1xufVxuXG5leHBvcnQgY29uc3QgZW51bSBSZWxhdGl2ZUluamVjdG9yTG9jYXRpb25GbGFncyB7XG4gIEluamVjdG9ySW5kZXhNYXNrID0gMGIxMTExMTExMTExMTExMTEsXG4gIFZpZXdPZmZzZXRTaGlmdCA9IDE2LFxuICBOT19QQVJFTlQgPSAtMSxcbn1cblxuZXhwb3J0IGNvbnN0IE5PX1BBUkVOVF9JTkpFQ1RPUjogUmVsYXRpdmVJbmplY3RvckxvY2F0aW9uID0gLTEgYXMgYW55O1xuXG4vKipcbiAqIEVhY2ggaW5qZWN0b3IgaXMgc2F2ZWQgaW4gOSBjb250aWd1b3VzIHNsb3RzIGluIGBMVmlld2AgYW5kIDkgY29udGlndW91cyBzbG90cyBpblxuICogYFRWaWV3LmRhdGFgLiBUaGlzIGFsbG93cyB1cyB0byBzdG9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCBub2RlJ3MgdG9rZW5zICh3aGljaFxuICogY2FuIGJlIHNoYXJlZCBpbiBgVFZpZXdgKSBhcyB3ZWxsIGFzIHRoZSB0b2tlbnMgb2YgaXRzIGFuY2VzdG9yIG5vZGVzICh3aGljaCBjYW5ub3QgYmVcbiAqIHNoYXJlZCwgc28gdGhleSBsaXZlIGluIGBMVmlld2ApLlxuICpcbiAqIEVhY2ggb2YgdGhlc2Ugc2xvdHMgKGFzaWRlIGZyb20gdGhlIGxhc3Qgc2xvdCkgY29udGFpbnMgYSBibG9vbSBmaWx0ZXIuIFRoaXMgYmxvb20gZmlsdGVyXG4gKiBkZXRlcm1pbmVzIHdoZXRoZXIgYSBkaXJlY3RpdmUgaXMgYXZhaWxhYmxlIG9uIHRoZSBhc3NvY2lhdGVkIG5vZGUgb3Igbm90LiBUaGlzIHByZXZlbnRzIHVzXG4gKiBmcm9tIHNlYXJjaGluZyB0aGUgZGlyZWN0aXZlcyBhcnJheSBhdCB0aGlzIGxldmVsIHVubGVzcyBpdCdzIHByb2JhYmxlIHRoZSBkaXJlY3RpdmUgaXMgaW4gaXQuXG4gKlxuICogU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CbG9vbV9maWx0ZXIgZm9yIG1vcmUgYWJvdXQgYmxvb20gZmlsdGVycy5cbiAqXG4gKiBCZWNhdXNlIGFsbCBpbmplY3RvcnMgaGF2ZSBiZWVuIGZsYXR0ZW5lZCBpbnRvIGBMVmlld2AgYW5kIGBUVmlld0RhdGFgLCB0aGV5IGNhbm5vdCB0eXBlZFxuICogdXNpbmcgaW50ZXJmYWNlcyBhcyB0aGV5IHdlcmUgcHJldmlvdXNseS4gVGhlIHN0YXJ0IGluZGV4IG9mIGVhY2ggYExJbmplY3RvcmAgYW5kIGBUSW5qZWN0b3JgXG4gKiB3aWxsIGRpZmZlciBiYXNlZCBvbiB3aGVyZSBpdCBpcyBmbGF0dGVuZWQgaW50byB0aGUgbWFpbiBhcnJheSwgc28gaXQncyBub3QgcG9zc2libGUgdG8ga25vd1xuICogdGhlIGluZGljZXMgYWhlYWQgb2YgdGltZSBhbmQgc2F2ZSB0aGVpciB0eXBlcyBoZXJlLiBUaGUgaW50ZXJmYWNlcyBhcmUgc3RpbGwgaW5jbHVkZWQgaGVyZVxuICogZm9yIGRvY3VtZW50YXRpb24gcHVycG9zZXMuXG4gKlxuICogZXhwb3J0IGludGVyZmFjZSBMSW5qZWN0b3IgZXh0ZW5kcyBBcnJheTxhbnk+IHtcbiAqXG4gKiAgICAvLyBDdW11bGF0aXZlIGJsb29tIGZvciBkaXJlY3RpdmUgSURzIDAtMzEgIChJRHMgYXJlICUgQkxPT01fU0laRSlcbiAqICAgIFswXTogbnVtYmVyO1xuICpcbiAqICAgIC8vIEN1bXVsYXRpdmUgYmxvb20gZm9yIGRpcmVjdGl2ZSBJRHMgMzItNjNcbiAqICAgIFsxXTogbnVtYmVyO1xuICpcbiAqICAgIC8vIEN1bXVsYXRpdmUgYmxvb20gZm9yIGRpcmVjdGl2ZSBJRHMgNjQtOTVcbiAqICAgIFsyXTogbnVtYmVyO1xuICpcbiAqICAgIC8vIEN1bXVsYXRpdmUgYmxvb20gZm9yIGRpcmVjdGl2ZSBJRHMgOTYtMTI3XG4gKiAgICBbM106IG51bWJlcjtcbiAqXG4gKiAgICAvLyBDdW11bGF0aXZlIGJsb29tIGZvciBkaXJlY3RpdmUgSURzIDEyOC0xNTlcbiAqICAgIFs0XTogbnVtYmVyO1xuICpcbiAqICAgIC8vIEN1bXVsYXRpdmUgYmxvb20gZm9yIGRpcmVjdGl2ZSBJRHMgMTYwIC0gMTkxXG4gKiAgICBbNV06IG51bWJlcjtcbiAqXG4gKiAgICAvLyBDdW11bGF0aXZlIGJsb29tIGZvciBkaXJlY3RpdmUgSURzIDE5MiAtIDIyM1xuICogICAgWzZdOiBudW1iZXI7XG4gKlxuICogICAgLy8gQ3VtdWxhdGl2ZSBibG9vbSBmb3IgZGlyZWN0aXZlIElEcyAyMjQgLSAyNTVcbiAqICAgIFs3XTogbnVtYmVyO1xuICpcbiAqICAgIC8vIFdlIG5lZWQgdG8gc3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGluamVjdG9yJ3MgcGFyZW50IHNvIERJIGNhbiBrZWVwIGxvb2tpbmcgdXBcbiAqICAgIC8vIHRoZSBpbmplY3RvciB0cmVlIHVudGlsIGl0IGZpbmRzIHRoZSBkZXBlbmRlbmN5IGl0J3MgbG9va2luZyBmb3IuXG4gKiAgICBbUEFSRU5UX0lOSkVDVE9SXTogbnVtYmVyO1xuICogfVxuICpcbiAqIGV4cG9ydCBpbnRlcmZhY2UgVEluamVjdG9yIGV4dGVuZHMgQXJyYXk8YW55PiB7XG4gKlxuICogICAgLy8gU2hhcmVkIG5vZGUgYmxvb20gZm9yIGRpcmVjdGl2ZSBJRHMgMC0zMSAgKElEcyBhcmUgJSBCTE9PTV9TSVpFKVxuICogICAgWzBdOiBudW1iZXI7XG4gKlxuICogICAgLy8gU2hhcmVkIG5vZGUgYmxvb20gZm9yIGRpcmVjdGl2ZSBJRHMgMzItNjNcbiAqICAgIFsxXTogbnVtYmVyO1xuICpcbiAqICAgIC8vIFNoYXJlZCBub2RlIGJsb29tIGZvciBkaXJlY3RpdmUgSURzIDY0LTk1XG4gKiAgICBbMl06IG51bWJlcjtcbiAqXG4gKiAgICAvLyBTaGFyZWQgbm9kZSBibG9vbSBmb3IgZGlyZWN0aXZlIElEcyA5Ni0xMjdcbiAqICAgIFszXTogbnVtYmVyO1xuICpcbiAqICAgIC8vIFNoYXJlZCBub2RlIGJsb29tIGZvciBkaXJlY3RpdmUgSURzIDEyOC0xNTlcbiAqICAgIFs0XTogbnVtYmVyO1xuICpcbiAqICAgIC8vIFNoYXJlZCBub2RlIGJsb29tIGZvciBkaXJlY3RpdmUgSURzIDE2MCAtIDE5MVxuICogICAgWzVdOiBudW1iZXI7XG4gKlxuICogICAgLy8gU2hhcmVkIG5vZGUgYmxvb20gZm9yIGRpcmVjdGl2ZSBJRHMgMTkyIC0gMjIzXG4gKiAgICBbNl06IG51bWJlcjtcbiAqXG4gKiAgICAvLyBTaGFyZWQgbm9kZSBibG9vbSBmb3IgZGlyZWN0aXZlIElEcyAyMjQgLSAyNTVcbiAqICAgIFs3XTogbnVtYmVyO1xuICpcbiAqICAgIC8vIE5lY2Vzc2FyeSB0byBmaW5kIGRpcmVjdGl2ZSBpbmRpY2VzIGZvciBhIHBhcnRpY3VsYXIgbm9kZS5cbiAqICAgIFtUTk9ERV06IFRFbGVtZW50Tm9kZXxURWxlbWVudENvbnRhaW5lck5vZGV8VENvbnRhaW5lck5vZGU7XG4gKiAgfVxuICovXG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcgaW5zdGFuY2VzIG9mIGluamVjdG9ycyBpbiB0aGUgTm9kZUluamVjdG9yLlxuICpcbiAqIFRoaXMgZmFjdG9yeSBpcyBjb21wbGljYXRlZCBieSB0aGUgZmFjdCB0aGF0IGl0IGNhbiByZXNvbHZlIGBtdWx0aWAgZmFjdG9yaWVzIGFzIHdlbGwuXG4gKlxuICogTk9URTogU29tZSBvZiB0aGUgZmllbGRzIGFyZSBvcHRpb25hbCB3aGljaCBtZWFucyB0aGF0IHRoaXMgY2xhc3MgaGFzIHR3byBoaWRkZW4gY2xhc3Nlcy5cbiAqIC0gT25lIHdpdGhvdXQgYG11bHRpYCBzdXBwb3J0IChtb3N0IGNvbW1vbilcbiAqIC0gT25lIHdpdGggYG11bHRpYCB2YWx1ZXMsIChyYXJlKS5cbiAqXG4gKiBTaW5jZSBWTXMgY2FuIGNhY2hlIHVwIHRvIDQgaW5saW5lIGhpZGRlbiBjbGFzc2VzIHRoaXMgaXMgT0suXG4gKlxuICogLSBTaW5nbGUgZmFjdG9yeTogT25seSBgcmVzb2x2aW5nYCBhbmQgYGZhY3RvcnlgIGlzIGRlZmluZWQuXG4gKiAtIGBwcm92aWRlcnNgIGZhY3Rvcnk6IGBjb21wb25lbnRQcm92aWRlcnNgIGlzIGEgbnVtYmVyIGFuZCBgaW5kZXggPSAtMWAuXG4gKiAtIGB2aWV3UHJvdmlkZXJzYCBmYWN0b3J5OiBgY29tcG9uZW50UHJvdmlkZXJzYCBpcyBhIG51bWJlciBhbmQgYGluZGV4YCBwb2ludHMgdG8gYHByb3ZpZGVyc2AuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb2RlSW5qZWN0b3JGYWN0b3J5IHtcbiAgLyoqXG4gICAqIFRoZSBpbmplY3QgaW1wbGVtZW50YXRpb24gdG8gYmUgYWN0aXZhdGVkIHdoZW4gdXNpbmcgdGhlIGZhY3RvcnkuXG4gICAqL1xuICBpbmplY3RJbXBsOiBudWxsfCg8VD4odG9rZW46IFR5cGU8VD58SW5qZWN0aW9uVG9rZW48VD4sIGZsYWdzPzogSW5qZWN0RmxhZ3MpID0+IFQpO1xuXG4gIC8qKlxuICAgKiBNYXJrZXIgc2V0IHRvIHRydWUgZHVyaW5nIGZhY3RvcnkgaW52b2NhdGlvbiB0byBzZWUgaWYgd2UgZ2V0IGludG8gcmVjdXJzaXZlIGxvb3AuXG4gICAqIFJlY3Vyc2l2ZSBsb29wIGNhdXNlcyBhbiBlcnJvciB0byBiZSBkaXNwbGF5ZWQuXG4gICAqL1xuICByZXNvbHZpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogTWFya3MgdGhhdCB0aGUgdG9rZW4gY2FuIHNlZSBvdGhlciBUb2tlbnMgZGVjbGFyZWQgaW4gYHZpZXdQcm92aWRlcnNgIG9uIHRoZSBzYW1lIG5vZGUuXG4gICAqL1xuICBjYW5TZWVWaWV3UHJvdmlkZXJzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBmYWN0b3JpZXMgdG8gdXNlIGluIGNhc2Ugb2YgYG11bHRpYCBwcm92aWRlci5cbiAgICovXG4gIG11bHRpPzogQXJyYXk8KCkgPT4gYW55PjtcblxuICAvKipcbiAgICogTnVtYmVyIG9mIGBtdWx0aWAtcHJvdmlkZXJzIHdoaWNoIGJlbG9uZyB0byB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHdoZW4gbXVsdGlwbGUgY29tcG9uZW50cyBhbmQgZGlyZWN0aXZlcyBkZWNsYXJlIHRoZSBgbXVsdGlgIHByb3ZpZGVyXG4gICAqIHRoZXkgaGF2ZSB0byBiZSBjb25jYXRlbmF0ZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqXG4gICAqIElmIHdlIGhhdmUgYSBjb21wb25lbnQgYW5kIGRpcmVjdGl2ZSBhY3RpdmUgYW4gYSBzaW5nbGUgZWxlbWVudCBhcyBkZWNsYXJlZCBoZXJlXG4gICAqIGBgYFxuICAgKiBjb21wb25lbnQ6XG4gICAqICAgcHJvdmlkZXM6IFsge3Byb3ZpZGU6IFN0cmluZywgdXNlVmFsdWU6ICdjb21wb25lbnQnLCBtdWx0aTogdHJ1ZX0gXSxcbiAgICogICB2aWV3UHJvdmlkZXM6IFsge3Byb3ZpZGU6IFN0cmluZywgdXNlVmFsdWU6ICdjb21wb25lbnRWaWV3JywgbXVsdGk6IHRydWV9IF0sXG4gICAqXG4gICAqIGRpcmVjdGl2ZTpcbiAgICogICBwcm92aWRlczogWyB7cHJvdmlkZTogU3RyaW5nLCB1c2VWYWx1ZTogJ2RpcmVjdGl2ZScsIG11bHRpOiB0cnVlfSBdLFxuICAgKiBgYGBcbiAgICpcbiAgICogVGhlbiB0aGUgZXhwZWN0ZWQgcmVzdWx0cyBhcmU6XG4gICAqXG4gICAqIGBgYFxuICAgKiBwcm92aWRlcnM6IFsnY29tcG9uZW50JywgJ2RpcmVjdGl2ZSddXG4gICAqIHZpZXdQcm92aWRlcnM6IFsnY29tcG9uZW50JywgJ2NvbXBvbmVudFZpZXcnLCAnZGlyZWN0aXZlJ11cbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSB3YXkgdG8gdGhpbmsgYWJvdXQgaXQgaXMgdGhhdCB0aGUgYHZpZXdQcm92aWRlcnNgIGhhdmUgYmVlbiBpbnNlcnRlZCBhZnRlciB0aGUgY29tcG9uZW50XG4gICAqIGJ1dCBiZWZvcmUgdGhlIGRpcmVjdGl2ZXMsIHdoaWNoIGlzIHdoeSB3ZSBuZWVkIHRvIGtub3cgaG93IG1hbnkgYG11bHRpYHMgaGF2ZSBiZWVuIGRlY2xhcmVkIGJ5XG4gICAqIHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBjb21wb25lbnRQcm92aWRlcnM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgaW5kZXggb2YgdGhlIEZhY3RvcnkgaW4gdGhlIGBkYXRhYC4gTmVlZGVkIGZvciBgdmlld1Byb3ZpZGVyc2AgYW5kIGBwcm92aWRlcnNgIG1lcmdpbmcuXG4gICAqIFNlZSBgcHJvdmlkZXJGYWN0b3J5YC5cbiAgICovXG4gIGluZGV4PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBCZWNhdXNlIHRoZSBzYW1lIGBtdWx0aWAgcHJvdmlkZXIgY2FuIGJlIGRlY2xhcmVkIGluIGBwcm92aWRlc2AgYW5kIGB2aWV3UHJvdmlkZXNgIGl0IGlzXG4gICAqIHBvc3NpYmxlIGZvciBgdmlld1Byb3ZpZGVzYCB0byBzaGFkb3cgdGhlIGBwcm92aWRlc2AuIEZvciB0aGlzIHJlYXNvbiB3ZSBzdG9yZSB0aGVcbiAgICogYHByb3ZpZGVGYWN0b3J5YCBvZiB0aGUgYHByb3ZpZGVyc2Agc28gdGhhdCBgcHJvdmlkZXJzYCBjYW4gYmUgZXh0ZW5kZWQgd2l0aCBgdmlld1Byb3ZpZGVyc2AuXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqXG4gICAqIEdpdmVuOlxuICAgKiBgYGBcbiAgICogcHJvdmlkZXM6IFsge3Byb3ZpZGU6IFN0cmluZywgdXNlVmFsdWU6ICdhbGwnLCBtdWx0aTogdHJ1ZX0gXSxcbiAgICogdmlld1Byb3ZpZGVzOiBbIHtwcm92aWRlOiBTdHJpbmcsIHVzZVZhbHVlOiAndmlld09ubHknLCBtdWx0aTogdHJ1ZX0gXSxcbiAgICogYGBgXG4gICAqXG4gICAqIFdlIGhhdmUgdG8gcmV0dXJuIGBbJ2FsbCddYCBpbiBjYXNlIG9mIGNvbnRlbnQgaW5qZWN0aW9uLCBidXQgYFsnYWxsJywgJ3ZpZXdPbmx5J11gIGluIGNhc2VcbiAgICogb2YgdmlldyBpbmplY3Rpb24uIFdlIGZ1cnRoZXIgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgc2hhcmVkIGluc3RhbmNlcyAoaW4gb3VyIGNhc2VcbiAgICogYGFsbGApIGFyZSB0aGUgZXhhY3Qgc2FtZSBpbnN0YW5jZSBpbiBib3RoIHRoZSBjb250ZW50IGFzIHdlbGwgYXMgdGhlIHZpZXcgaW5qZWN0aW9uLiAoV2VcbiAgICogaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCBkb3VibGUgaW5zdGFudGlhdGUuKSBGb3IgdGhpcyByZWFzb24gdGhlIGB2aWV3UHJvdmlkZXNgXG4gICAqIGBGYWN0b3J5YCBoYXMgYSBwb2ludGVyIHRvIHRoZSBzaGFkb3dlZCBgcHJvdmlkZXNgIGZhY3Rvcnkgc28gdGhhdCBpdCBjYW4gaW5zdGFudGlhdGUgdGhlXG4gICAqIGBwcm92aWRlcnNgIChgWydhbGwnXWApIGFuZCB0aGVuIGV4dGVuZCBpdCB3aXRoIGB2aWV3UHJvdmlkZXJzYCAoYFsnYWxsJ10gKyBbJ3ZpZXdPbmx5J10gPVxuICAgKiBbJ2FsbCcsICd2aWV3T25seSddYCkuXG4gICAqL1xuICBwcm92aWRlckZhY3Rvcnk/OiBOb2RlSW5qZWN0b3JGYWN0b3J5fG51bGw7XG5cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIC8qKlxuICAgICAgICogRmFjdG9yeSB0byBpbnZva2UgaW4gb3JkZXIgdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuICAgICAgICovXG4gICAgICBwdWJsaWMgZmFjdG9yeTpcbiAgICAgICAgICAodGhpczogTm9kZUluamVjdG9yRmFjdG9yeSwgXzogdW5kZWZpbmVkLFxuICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogYXJyYXkgd2hlcmUgaW5qZWN0YWJsZXMgdG9rZW5zIGFyZSBzdG9yZWQuIFRoaXMgaXMgdXNlZCBpblxuICAgICAgICAgICAgKiBjYXNlIG9mIGFuIGVycm9yIHJlcG9ydGluZyB0byBwcm9kdWNlIGZyaWVuZGxpZXIgZXJyb3JzLlxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgdERhdGE6IFREYXRhLFxuICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogYXJyYXkgd2hlcmUgZXhpc3RpbmcgaW5zdGFuY2VzIG9mIGluamVjdGFibGVzIGFyZSBzdG9yZWQuIFRoaXMgaXMgdXNlZCBpbiBjYXNlXG4gICAgICAgICAgICAqIG9mIG11bHRpIHNoYWRvdyBpcyBuZWVkZWQuIFNlZSBgbXVsdGlgIGZpZWxkIGRvY3VtZW50YXRpb24uXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICBsVmlldzogTFZpZXcsXG4gICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiBUaGUgVE5vZGUgb2YgdGhlIHNhbWUgZWxlbWVudCBpbmplY3Rvci5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgIHROb2RlOiBURGlyZWN0aXZlSG9zdE5vZGUpID0+IGFueSxcbiAgICAgIC8qKlxuICAgICAgICogU2V0IHRvIGB0cnVlYCBpZiB0aGUgdG9rZW4gaXMgZGVjbGFyZWQgaW4gYHZpZXdQcm92aWRlcnNgIChvciBpZiBpdCBpcyBjb21wb25lbnQpLlxuICAgICAgICovXG4gICAgICBpc1ZpZXdQcm92aWRlcjogYm9vbGVhbixcbiAgICAgIGluamVjdEltcGxlbWVudGF0aW9uOiBudWxsfFxuICAgICAgKDxUPih0b2tlbjogVHlwZTxUPnxJbmplY3Rpb25Ub2tlbjxUPiwgZmxhZ3M/OiBJbmplY3RGbGFncykgPT4gVCkpIHtcbiAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZChmYWN0b3J5LCAnRmFjdG9yeSBub3Qgc3BlY2lmaWVkJyk7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydEVxdWFsKHR5cGVvZiBmYWN0b3J5LCAnZnVuY3Rpb24nLCAnRXhwZWN0ZWQgZmFjdG9yeSBmdW5jdGlvbi4nKTtcbiAgICB0aGlzLmNhblNlZVZpZXdQcm92aWRlcnMgPSBpc1ZpZXdQcm92aWRlcjtcbiAgICB0aGlzLmluamVjdEltcGwgPSBpbmplY3RJbXBsZW1lbnRhdGlvbjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGYWN0b3J5KG9iajogYW55KTogb2JqIGlzIE5vZGVJbmplY3RvckZhY3Rvcnkge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTm9kZUluamVjdG9yRmFjdG9yeTtcbn1cblxuLy8gTm90ZTogVGhpcyBoYWNrIGlzIG5lY2Vzc2FyeSBzbyB3ZSBkb24ndCBlcnJvbmVvdXNseSBnZXQgYSBjaXJjdWxhciBkZXBlbmRlbmN5XG4vLyBmYWlsdXJlIGJhc2VkIG9uIHR5cGVzLlxuZXhwb3J0IGNvbnN0IHVudXNlZFZhbHVlRXhwb3J0VG9QbGFjYXRlQWpkID0gMTtcbiJdfQ==