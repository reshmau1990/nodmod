/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '../util/ng_dev_mode';
import { getClosureSafeProperty } from '../util/property';
import { stringify } from '../util/stringify';
import { resolveForwardRef } from './forward_ref';
import { getInjectImplementation, injectRootLimpMode } from './inject_switch';
import { InjectFlags } from './interface/injector';
import { Inject, Optional, Self, SkipSelf } from './metadata';
const _THROW_IF_NOT_FOUND = {};
export const THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
export const NG_TEMP_TOKEN_PATH = 'ngTempTokenPath';
const NG_TOKEN_PATH = 'ngTokenPath';
const NEW_LINE = /\n/gm;
const NO_NEW_LINE = 'ɵ';
export const SOURCE = '__source';
const ɵ0 = getClosureSafeProperty;
export const USE_VALUE = getClosureSafeProperty({ provide: String, useValue: ɵ0 });
/**
 * Current injector value used by `inject`.
 * - `undefined`: it is an error to call `inject`
 * - `null`: `inject` can be called but there is no injector (limp-mode).
 * - Injector instance: Use the injector for resolution.
 */
let _currentInjector = undefined;
export function setCurrentInjector(injector) {
    const former = _currentInjector;
    _currentInjector = injector;
    return former;
}
export function injectInjectorOnly(token, flags = InjectFlags.Default) {
    if (_currentInjector === undefined) {
        throw new Error(`inject() must be called from an injection context`);
    }
    else if (_currentInjector === null) {
        return injectRootLimpMode(token, undefined, flags);
    }
    else {
        return _currentInjector.get(token, flags & InjectFlags.Optional ? null : undefined, flags);
    }
}
export function ɵɵinject(token, flags = InjectFlags.Default) {
    return (getInjectImplementation() || injectInjectorOnly)(resolveForwardRef(token), flags);
}
/**
 * Throws an error indicating that a factory function could not be generated by the compiler for a
 * particular class.
 *
 * This instruction allows the actual error message to be optimized away when ngDevMode is turned
 * off, saving bytes of generated code while still providing a good experience in dev mode.
 *
 * The name of the class is not mentioned here, but will be in the generated factory function name
 * and thus in the stack trace.
 *
 * @codeGenApi
 */
export function ɵɵinvalidFactoryDep(index) {
    const msg = ngDevMode ?
        `This constructor is not compatible with Angular Dependency Injection because its dependency at index ${index} of the parameter list is invalid.
This can happen if the dependency type is a primitive like a string or if an ancestor of this class is missing an Angular decorator.

Please check that 1) the type for the parameter at index ${index} is correct and 2) the correct Angular decorators are defined for this class and its ancestors.` :
        'invalid';
    throw new Error(msg);
}
/**
 * Injects a token from the currently active injector.
 *
 * Must be used in the context of a factory function such as one defined for an
 * `InjectionToken`. Throws an error if not called from such a context.
 *
 * Within such a factory function, using this function to request injection of a dependency
 * is faster and more type-safe than providing an additional array of dependencies
 * (as has been common with `useFactory` providers).
 *
 * @param token The injection token for the dependency to be injected.
 * @param flags Optional flags that control how injection is executed.
 * The flags correspond to injection strategies that can be specified with
 * parameter decorators `@Host`, `@Self`, `@SkipSef`, and `@Optional`.
 * @returns True if injection is successful, null otherwise.
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example core/di/ts/injector_spec.ts region='ShakableInjectionToken'}
 *
 * @publicApi
 */
export const inject = ɵɵinject;
export function injectArgs(types) {
    const args = [];
    for (let i = 0; i < types.length; i++) {
        const arg = resolveForwardRef(types[i]);
        if (Array.isArray(arg)) {
            if (arg.length === 0) {
                throw new Error('Arguments array must have arguments.');
            }
            let type = undefined;
            let flags = InjectFlags.Default;
            for (let j = 0; j < arg.length; j++) {
                const meta = arg[j];
                if (meta instanceof Optional || meta.ngMetadataName === 'Optional' || meta === Optional) {
                    flags |= InjectFlags.Optional;
                }
                else if (meta instanceof SkipSelf || meta.ngMetadataName === 'SkipSelf' || meta === SkipSelf) {
                    flags |= InjectFlags.SkipSelf;
                }
                else if (meta instanceof Self || meta.ngMetadataName === 'Self' || meta === Self) {
                    flags |= InjectFlags.Self;
                }
                else if (meta instanceof Inject || meta === Inject) {
                    type = meta.token;
                }
                else {
                    type = meta;
                }
            }
            args.push(ɵɵinject(type, flags));
        }
        else {
            args.push(ɵɵinject(arg));
        }
    }
    return args;
}
export function catchInjectorError(e, token, injectorErrorName, source) {
    const tokenPath = e[NG_TEMP_TOKEN_PATH];
    if (token[SOURCE]) {
        tokenPath.unshift(token[SOURCE]);
    }
    e.message = formatError('\n' + e.message, tokenPath, injectorErrorName, source);
    e[NG_TOKEN_PATH] = tokenPath;
    e[NG_TEMP_TOKEN_PATH] = null;
    throw e;
}
export function formatError(text, obj, injectorErrorName, source = null) {
    text = text && text.charAt(0) === '\n' && text.charAt(1) == NO_NEW_LINE ? text.substr(2) : text;
    let context = stringify(obj);
    if (Array.isArray(obj)) {
        context = obj.map(stringify).join(' -> ');
    }
    else if (typeof obj === 'object') {
        let parts = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                parts.push(key + ':' + (typeof value === 'string' ? JSON.stringify(value) : stringify(value)));
            }
        }
        context = `{${parts.join(', ')}}`;
    }
    return `${injectorErrorName}${source ? '(' + source + ')' : ''}[${context}]: ${text.replace(NEW_LINE, '\n  ')}`;
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0b3JfY29tcGF0aWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL2luamVjdG9yX2NvbXBhdGliaWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxxQkFBcUIsQ0FBQztBQUc3QixPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRzVFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVqRCxPQUFPLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRzVELE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLG1CQUFtQixDQUFDO0FBRXRELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLGlCQUFpQixDQUFDO0FBQ3BELE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQztBQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDeEIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUM7V0FHcUMsc0JBQXNCO0FBRDVGLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FDbEIsc0JBQXNCLENBQWdCLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLElBQXdCLEVBQUMsQ0FBQyxDQUFDO0FBRS9GOzs7OztHQUtHO0FBQ0gsSUFBSSxn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QUFPLE1BQ3JFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDdkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgJy4uL3V0aWwvbmdfZGV2X21vZGUnO1xuXG5pbXBvcnQge1R5cGV9IGZyb20gJy4uL2ludGVyZmFjZS90eXBlJztcbmltcG9ydCB7Z2V0Q2xvc3VyZVNhZmVQcm9wZXJ0eX0gZnJvbSAnLi4vdXRpbC9wcm9wZXJ0eSc7XG5pbXBvcnQge3N0cmluZ2lmeX0gZnJvbSAnLi4vdXRpbC9zdHJpbmdpZnknO1xuaW1wb3J0IHtyZXNvbHZlRm9yd2FyZFJlZn0gZnJvbSAnLi9mb3J3YXJkX3JlZic7XG5pbXBvcnQge2dldEluamVjdEltcGxlbWVudGF0aW9uLCBpbmplY3RSb290TGltcE1vZGV9IGZyb20gJy4vaW5qZWN0X3N3aXRjaCc7XG5pbXBvcnQge0luamVjdGlvblRva2VufSBmcm9tICcuL2luamVjdGlvbl90b2tlbic7XG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuL2luamVjdG9yJztcbmltcG9ydCB7SW5qZWN0RmxhZ3N9IGZyb20gJy4vaW50ZXJmYWNlL2luamVjdG9yJztcbmltcG9ydCB7VmFsdWVQcm92aWRlcn0gZnJvbSAnLi9pbnRlcmZhY2UvcHJvdmlkZXInO1xuaW1wb3J0IHtJbmplY3QsIE9wdGlvbmFsLCBTZWxmLCBTa2lwU2VsZn0gZnJvbSAnLi9tZXRhZGF0YSc7XG5cblxuY29uc3QgX1RIUk9XX0lGX05PVF9GT1VORCA9IHt9O1xuZXhwb3J0IGNvbnN0IFRIUk9XX0lGX05PVF9GT1VORCA9IF9USFJPV19JRl9OT1RfRk9VTkQ7XG5cbmV4cG9ydCBjb25zdCBOR19URU1QX1RPS0VOX1BBVEggPSAnbmdUZW1wVG9rZW5QYXRoJztcbmNvbnN0IE5HX1RPS0VOX1BBVEggPSAnbmdUb2tlblBhdGgnO1xuY29uc3QgTkVXX0xJTkUgPSAvXFxuL2dtO1xuY29uc3QgTk9fTkVXX0xJTkUgPSAnybUnO1xuZXhwb3J0IGNvbnN0IFNPVVJDRSA9ICdfX3NvdXJjZSc7XG5cbmV4cG9ydCBjb25zdCBVU0VfVkFMVUUgPVxuICAgIGdldENsb3N1cmVTYWZlUHJvcGVydHk8VmFsdWVQcm92aWRlcj4oe3Byb3ZpZGU6IFN0cmluZywgdXNlVmFsdWU6IGdldENsb3N1cmVTYWZlUHJvcGVydHl9KTtcblxuLyoqXG4gKiBDdXJyZW50IGluamVjdG9yIHZhbHVlIHVzZWQgYnkgYGluamVjdGAuXG4gKiAtIGB1bmRlZmluZWRgOiBpdCBpcyBhbiBlcnJvciB0byBjYWxsIGBpbmplY3RgXG4gKiAtIGBudWxsYDogYGluamVjdGAgY2FuIGJlIGNhbGxlZCBidXQgdGhlcmUgaXMgbm8gaW5qZWN0b3IgKGxpbXAtbW9kZSkuXG4gKiAtIEluamVjdG9yIGluc3RhbmNlOiBVc2UgdGhlIGluamVjdG9yIGZvciByZXNvbHV0aW9uLlxuICovXG5sZXQgX2N1cnJlbnRJbmplY3RvcjogSW5qZWN0b3J8dW5kZWZpbmVkfG51bGwgPSB1bmRlZmluZWQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJyZW50SW5qZWN0b3IoaW5qZWN0b3I6IEluamVjdG9yfG51bGx8dW5kZWZpbmVkKTogSW5qZWN0b3J8dW5kZWZpbmVkfG51bGwge1xuICBjb25zdCBmb3JtZXIgPSBfY3VycmVudEluamVjdG9yO1xuICBfY3VycmVudEluamVjdG9yID0gaW5qZWN0b3I7XG4gIHJldHVybiBmb3JtZXI7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEluamVjdG9yT25seTxUPih0b2tlbjogVHlwZTxUPnxJbmplY3Rpb25Ub2tlbjxUPik6IFQ7XG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0SW5qZWN0b3JPbmx5PFQ+KHRva2VuOiBUeXBlPFQ+fEluamVjdGlvblRva2VuPFQ+LCBmbGFncz86IEluamVjdEZsYWdzKTogVHxcbiAgICBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEluamVjdG9yT25seTxUPihcbiAgICB0b2tlbjogVHlwZTxUPnxJbmplY3Rpb25Ub2tlbjxUPiwgZmxhZ3MgPSBJbmplY3RGbGFncy5EZWZhdWx0KTogVHxudWxsIHtcbiAgaWYgKF9jdXJyZW50SW5qZWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgaW5qZWN0KCkgbXVzdCBiZSBjYWxsZWQgZnJvbSBhbiBpbmplY3Rpb24gY29udGV4dGApO1xuICB9IGVsc2UgaWYgKF9jdXJyZW50SW5qZWN0b3IgPT09IG51bGwpIHtcbiAgICByZXR1cm4gaW5qZWN0Um9vdExpbXBNb2RlKHRva2VuLCB1bmRlZmluZWQsIGZsYWdzKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX2N1cnJlbnRJbmplY3Rvci5nZXQodG9rZW4sIGZsYWdzICYgSW5qZWN0RmxhZ3MuT3B0aW9uYWwgPyBudWxsIDogdW5kZWZpbmVkLCBmbGFncyk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZWQgaW5zdHJ1Y3Rpb246IEluamVjdHMgYSB0b2tlbiBmcm9tIHRoZSBjdXJyZW50bHkgYWN0aXZlIGluamVjdG9yLlxuICpcbiAqIE11c3QgYmUgdXNlZCBpbiB0aGUgY29udGV4dCBvZiBhIGZhY3RvcnkgZnVuY3Rpb24gc3VjaCBhcyBvbmUgZGVmaW5lZCBmb3IgYW5cbiAqIGBJbmplY3Rpb25Ub2tlbmAuIFRocm93cyBhbiBlcnJvciBpZiBub3QgY2FsbGVkIGZyb20gc3VjaCBhIGNvbnRleHQuXG4gKlxuICogKEFkZGl0aW9uYWwgZG9jdW1lbnRhdGlvbiBtb3ZlZCB0byBgaW5qZWN0YCwgYXMgaXQgaXMgdGhlIHB1YmxpYyBBUEksIGFuZCBhbiBhbGlhcyBmb3IgdGhpc1xuICogaW5zdHJ1Y3Rpb24pXG4gKlxuICogQHNlZSBpbmplY3RcbiAqIEBjb2RlR2VuQXBpXG4gKiBAcHVibGljQXBpIFRoaXMgaW5zdHJ1Y3Rpb24gaGFzIGJlZW4gZW1pdHRlZCBieSBWaWV3RW5naW5lIGZvciBzb21lIHRpbWUgYW5kIGlzIGRlcGxveWVkIHRvIG5wbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVpbmplY3Q8VD4odG9rZW46IFR5cGU8VD58SW5qZWN0aW9uVG9rZW48VD4pOiBUO1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVpbmplY3Q8VD4odG9rZW46IFR5cGU8VD58SW5qZWN0aW9uVG9rZW48VD4sIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBUfG51bGw7XG5leHBvcnQgZnVuY3Rpb24gybXJtWluamVjdDxUPih0b2tlbjogVHlwZTxUPnxJbmplY3Rpb25Ub2tlbjxUPiwgZmxhZ3MgPSBJbmplY3RGbGFncy5EZWZhdWx0KTogVHxudWxsIHtcbiAgcmV0dXJuIChnZXRJbmplY3RJbXBsZW1lbnRhdGlvbigpIHx8IGluamVjdEluamVjdG9yT25seSkocmVzb2x2ZUZvcndhcmRSZWYodG9rZW4pLCBmbGFncyk7XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGVycm9yIGluZGljYXRpbmcgdGhhdCBhIGZhY3RvcnkgZnVuY3Rpb24gY291bGQgbm90IGJlIGdlbmVyYXRlZCBieSB0aGUgY29tcGlsZXIgZm9yIGFcbiAqIHBhcnRpY3VsYXIgY2xhc3MuXG4gKlxuICogVGhpcyBpbnN0cnVjdGlvbiBhbGxvd3MgdGhlIGFjdHVhbCBlcnJvciBtZXNzYWdlIHRvIGJlIG9wdGltaXplZCBhd2F5IHdoZW4gbmdEZXZNb2RlIGlzIHR1cm5lZFxuICogb2ZmLCBzYXZpbmcgYnl0ZXMgb2YgZ2VuZXJhdGVkIGNvZGUgd2hpbGUgc3RpbGwgcHJvdmlkaW5nIGEgZ29vZCBleHBlcmllbmNlIGluIGRldiBtb2RlLlxuICpcbiAqIFRoZSBuYW1lIG9mIHRoZSBjbGFzcyBpcyBub3QgbWVudGlvbmVkIGhlcmUsIGJ1dCB3aWxsIGJlIGluIHRoZSBnZW5lcmF0ZWQgZmFjdG9yeSBmdW5jdGlvbiBuYW1lXG4gKiBhbmQgdGh1cyBpbiB0aGUgc3RhY2sgdHJhY2UuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVpbnZhbGlkRmFjdG9yeURlcChpbmRleDogbnVtYmVyKTogbmV2ZXIge1xuICBjb25zdCBtc2cgPSBuZ0Rldk1vZGUgP1xuICAgICAgYFRoaXMgY29uc3RydWN0b3IgaXMgbm90IGNvbXBhdGlibGUgd2l0aCBBbmd1bGFyIERlcGVuZGVuY3kgSW5qZWN0aW9uIGJlY2F1c2UgaXRzIGRlcGVuZGVuY3kgYXQgaW5kZXggJHtcbiAgICAgICAgICBpbmRleH0gb2YgdGhlIHBhcmFtZXRlciBsaXN0IGlzIGludmFsaWQuXG5UaGlzIGNhbiBoYXBwZW4gaWYgdGhlIGRlcGVuZGVuY3kgdHlwZSBpcyBhIHByaW1pdGl2ZSBsaWtlIGEgc3RyaW5nIG9yIGlmIGFuIGFuY2VzdG9yIG9mIHRoaXMgY2xhc3MgaXMgbWlzc2luZyBhbiBBbmd1bGFyIGRlY29yYXRvci5cblxuUGxlYXNlIGNoZWNrIHRoYXQgMSkgdGhlIHR5cGUgZm9yIHRoZSBwYXJhbWV0ZXIgYXQgaW5kZXggJHtcbiAgICAgICAgICBpbmRleH0gaXMgY29ycmVjdCBhbmQgMikgdGhlIGNvcnJlY3QgQW5ndWxhciBkZWNvcmF0b3JzIGFyZSBkZWZpbmVkIGZvciB0aGlzIGNsYXNzIGFuZCBpdHMgYW5jZXN0b3JzLmAgOlxuICAgICAgJ2ludmFsaWQnO1xuICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbn1cblxuLyoqXG4gKiBJbmplY3RzIGEgdG9rZW4gZnJvbSB0aGUgY3VycmVudGx5IGFjdGl2ZSBpbmplY3Rvci5cbiAqXG4gKiBNdXN0IGJlIHVzZWQgaW4gdGhlIGNvbnRleHQgb2YgYSBmYWN0b3J5IGZ1bmN0aW9uIHN1Y2ggYXMgb25lIGRlZmluZWQgZm9yIGFuXG4gKiBgSW5qZWN0aW9uVG9rZW5gLiBUaHJvd3MgYW4gZXJyb3IgaWYgbm90IGNhbGxlZCBmcm9tIHN1Y2ggYSBjb250ZXh0LlxuICpcbiAqIFdpdGhpbiBzdWNoIGEgZmFjdG9yeSBmdW5jdGlvbiwgdXNpbmcgdGhpcyBmdW5jdGlvbiB0byByZXF1ZXN0IGluamVjdGlvbiBvZiBhIGRlcGVuZGVuY3lcbiAqIGlzIGZhc3RlciBhbmQgbW9yZSB0eXBlLXNhZmUgdGhhbiBwcm92aWRpbmcgYW4gYWRkaXRpb25hbCBhcnJheSBvZiBkZXBlbmRlbmNpZXNcbiAqIChhcyBoYXMgYmVlbiBjb21tb24gd2l0aCBgdXNlRmFjdG9yeWAgcHJvdmlkZXJzKS5cbiAqXG4gKiBAcGFyYW0gdG9rZW4gVGhlIGluamVjdGlvbiB0b2tlbiBmb3IgdGhlIGRlcGVuZGVuY3kgdG8gYmUgaW5qZWN0ZWQuXG4gKiBAcGFyYW0gZmxhZ3MgT3B0aW9uYWwgZmxhZ3MgdGhhdCBjb250cm9sIGhvdyBpbmplY3Rpb24gaXMgZXhlY3V0ZWQuXG4gKiBUaGUgZmxhZ3MgY29ycmVzcG9uZCB0byBpbmplY3Rpb24gc3RyYXRlZ2llcyB0aGF0IGNhbiBiZSBzcGVjaWZpZWQgd2l0aFxuICogcGFyYW1ldGVyIGRlY29yYXRvcnMgYEBIb3N0YCwgYEBTZWxmYCwgYEBTa2lwU2VmYCwgYW5kIGBAT3B0aW9uYWxgLlxuICogQHJldHVybnMgVHJ1ZSBpZiBpbmplY3Rpb24gaXMgc3VjY2Vzc2Z1bCwgbnVsbCBvdGhlcndpc2UuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIHtAZXhhbXBsZSBjb3JlL2RpL3RzL2luamVjdG9yX3NwZWMudHMgcmVnaW9uPSdTaGFrYWJsZUluamVjdGlvblRva2VuJ31cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBpbmplY3QgPSDJtcm1aW5qZWN0O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RBcmdzKHR5cGVzOiAoVHlwZTxhbnk+fEluamVjdGlvblRva2VuPGFueT58YW55W10pW10pOiBhbnlbXSB7XG4gIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBhcmcgPSByZXNvbHZlRm9yd2FyZFJlZih0eXBlc1tpXSk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgaWYgKGFyZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudHMgYXJyYXkgbXVzdCBoYXZlIGFyZ3VtZW50cy4nKTtcbiAgICAgIH1cbiAgICAgIGxldCB0eXBlOiBUeXBlPGFueT58dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IGZsYWdzOiBJbmplY3RGbGFncyA9IEluamVjdEZsYWdzLkRlZmF1bHQ7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYXJnLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBhcmdbal07XG4gICAgICAgIGlmIChtZXRhIGluc3RhbmNlb2YgT3B0aW9uYWwgfHwgbWV0YS5uZ01ldGFkYXRhTmFtZSA9PT0gJ09wdGlvbmFsJyB8fCBtZXRhID09PSBPcHRpb25hbCkge1xuICAgICAgICAgIGZsYWdzIHw9IEluamVjdEZsYWdzLk9wdGlvbmFsO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgbWV0YSBpbnN0YW5jZW9mIFNraXBTZWxmIHx8IG1ldGEubmdNZXRhZGF0YU5hbWUgPT09ICdTa2lwU2VsZicgfHwgbWV0YSA9PT0gU2tpcFNlbGYpIHtcbiAgICAgICAgICBmbGFncyB8PSBJbmplY3RGbGFncy5Ta2lwU2VsZjtcbiAgICAgICAgfSBlbHNlIGlmIChtZXRhIGluc3RhbmNlb2YgU2VsZiB8fCBtZXRhLm5nTWV0YWRhdGFOYW1lID09PSAnU2VsZicgfHwgbWV0YSA9PT0gU2VsZikge1xuICAgICAgICAgIGZsYWdzIHw9IEluamVjdEZsYWdzLlNlbGY7XG4gICAgICAgIH0gZWxzZSBpZiAobWV0YSBpbnN0YW5jZW9mIEluamVjdCB8fCBtZXRhID09PSBJbmplY3QpIHtcbiAgICAgICAgICB0eXBlID0gbWV0YS50b2tlbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0eXBlID0gbWV0YTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhcmdzLnB1c2goybXJtWluamVjdCh0eXBlISwgZmxhZ3MpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKMm1ybVpbmplY3QoYXJnKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcmdzO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjYXRjaEluamVjdG9yRXJyb3IoXG4gICAgZTogYW55LCB0b2tlbjogYW55LCBpbmplY3RvckVycm9yTmFtZTogc3RyaW5nLCBzb3VyY2U6IHN0cmluZ3xudWxsKTogbmV2ZXIge1xuICBjb25zdCB0b2tlblBhdGg6IGFueVtdID0gZVtOR19URU1QX1RPS0VOX1BBVEhdO1xuICBpZiAodG9rZW5bU09VUkNFXSkge1xuICAgIHRva2VuUGF0aC51bnNoaWZ0KHRva2VuW1NPVVJDRV0pO1xuICB9XG4gIGUubWVzc2FnZSA9IGZvcm1hdEVycm9yKCdcXG4nICsgZS5tZXNzYWdlLCB0b2tlblBhdGgsIGluamVjdG9yRXJyb3JOYW1lLCBzb3VyY2UpO1xuICBlW05HX1RPS0VOX1BBVEhdID0gdG9rZW5QYXRoO1xuICBlW05HX1RFTVBfVE9LRU5fUEFUSF0gPSBudWxsO1xuICB0aHJvdyBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RXJyb3IoXG4gICAgdGV4dDogc3RyaW5nLCBvYmo6IGFueSwgaW5qZWN0b3JFcnJvck5hbWU6IHN0cmluZywgc291cmNlOiBzdHJpbmd8bnVsbCA9IG51bGwpOiBzdHJpbmcge1xuICB0ZXh0ID0gdGV4dCAmJiB0ZXh0LmNoYXJBdCgwKSA9PT0gJ1xcbicgJiYgdGV4dC5jaGFyQXQoMSkgPT0gTk9fTkVXX0xJTkUgPyB0ZXh0LnN1YnN0cigyKSA6IHRleHQ7XG4gIGxldCBjb250ZXh0ID0gc3RyaW5naWZ5KG9iaik7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICBjb250ZXh0ID0gb2JqLm1hcChzdHJpbmdpZnkpLmpvaW4oJyAtPiAnKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIGxldCBwYXJ0cyA9IDxzdHJpbmdbXT5bXTtcbiAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gb2JqW2tleV07XG4gICAgICAgIHBhcnRzLnB1c2goXG4gICAgICAgICAgICBrZXkgKyAnOicgKyAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KHZhbHVlKSA6IHN0cmluZ2lmeSh2YWx1ZSkpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGV4dCA9IGB7JHtwYXJ0cy5qb2luKCcsICcpfX1gO1xuICB9XG4gIHJldHVybiBgJHtpbmplY3RvckVycm9yTmFtZX0ke3NvdXJjZSA/ICcoJyArIHNvdXJjZSArICcpJyA6ICcnfVske2NvbnRleHR9XTogJHtcbiAgICAgIHRleHQucmVwbGFjZShORVdfTElORSwgJ1xcbiAgJyl9YDtcbn1cbiJdfQ==