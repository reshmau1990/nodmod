/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, NgModule, Optional, ɵConsole as Console } from '@angular/core';
import { EVENT_MANAGER_PLUGINS, EventManagerPlugin } from './event_manager';
/**
 * Supported HammerJS recognizer event names.
 */
const EVENT_NAMES = {
    // pan
    'pan': true,
    'panstart': true,
    'panmove': true,
    'panend': true,
    'pancancel': true,
    'panleft': true,
    'panright': true,
    'panup': true,
    'pandown': true,
    // pinch
    'pinch': true,
    'pinchstart': true,
    'pinchmove': true,
    'pinchend': true,
    'pinchcancel': true,
    'pinchin': true,
    'pinchout': true,
    // press
    'press': true,
    'pressup': true,
    // rotate
    'rotate': true,
    'rotatestart': true,
    'rotatemove': true,
    'rotateend': true,
    'rotatecancel': true,
    // swipe
    'swipe': true,
    'swipeleft': true,
    'swiperight': true,
    'swipeup': true,
    'swipedown': true,
    // tap
    'tap': true,
};
/**
 * DI token for providing [HammerJS](https://hammerjs.github.io/) support to Angular.
 * @see `HammerGestureConfig`
 *
 * @ngModule HammerModule
 * @publicApi
 */
export const HAMMER_GESTURE_CONFIG = new InjectionToken('HammerGestureConfig');
/**
 * Injection token used to provide a {@link HammerLoader} to Angular.
 *
 * @publicApi
 */
export const HAMMER_LOADER = new InjectionToken('HammerLoader');
/**
 * An injectable [HammerJS Manager](https://hammerjs.github.io/api/#hammermanager)
 * for gesture recognition. Configures specific event recognition.
 * @publicApi
 */
export class HammerGestureConfig {
    constructor() {
        /**
         * A set of supported event names for gestures to be used in Angular.
         * Angular supports all built-in recognizers, as listed in
         * [HammerJS documentation](https://hammerjs.github.io/).
         */
        this.events = [];
        /**
         * Maps gesture event names to a set of configuration options
         * that specify overrides to the default values for specific properties.
         *
         * The key is a supported event name to be configured,
         * and the options object contains a set of properties, with override values
         * to be applied to the named recognizer event.
         * For example, to disable recognition of the rotate event, specify
         *  `{"rotate": {"enable": false}}`.
         *
         * Properties that are not present take the HammerJS default values.
         * For information about which properties are supported for which events,
         * and their allowed and default values, see
         * [HammerJS documentation](https://hammerjs.github.io/).
         *
         */
        this.overrides = {};
    }
    /**
     * Creates a [HammerJS Manager](https://hammerjs.github.io/api/#hammermanager)
     * and attaches it to a given HTML element.
     * @param element The element that will recognize gestures.
     * @returns A HammerJS event-manager object.
     */
    buildHammer(element) {
        const mc = new Hammer(element, this.options);
        mc.get('pinch').set({ enable: true });
        mc.get('rotate').set({ enable: true });
        for (const eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }
        return mc;
    }
}
HammerGestureConfig.decorators = [
    { type: Injectable }
];
/**
 * Event plugin that adds Hammer support to an application.
 *
 * @ngModule HammerModule
 */
export class HammerGesturesPlugin extends EventManagerPlugin {
    constructor(doc, _config, console, loader) {
        super(doc);
        this._config = _config;
        this.console = console;
        this.loader = loader;
    }
    supports(eventName) {
        if (!EVENT_NAMES.hasOwnProperty(eventName.toLowerCase()) && !this.isCustomEvent(eventName)) {
            return false;
        }
        if (!window.Hammer && !this.loader) {
            this.console.warn(`The "${eventName}" event cannot be bound because Hammer.JS is not ` +
                `loaded and no custom loader has been specified.`);
            return false;
        }
        return true;
    }
    addEventListener(element, eventName, handler) {
        const zone = this.manager.getZone();
        eventName = eventName.toLowerCase();
        // If Hammer is not present but a loader is specified, we defer adding the event listener
        // until Hammer is loaded.
        if (!window.Hammer && this.loader) {
            // This `addEventListener` method returns a function to remove the added listener.
            // Until Hammer is loaded, the returned function needs to *cancel* the registration rather
            // than remove anything.
            let cancelRegistration = false;
            let deregister = () => {
                cancelRegistration = true;
            };
            this.loader()
                .then(() => {
                // If Hammer isn't actually loaded when the custom loader resolves, give up.
                if (!window.Hammer) {
                    this.console.warn(`The custom HAMMER_LOADER completed, but Hammer.JS is not present.`);
                    deregister = () => { };
                    return;
                }
                if (!cancelRegistration) {
                    // Now that Hammer is loaded and the listener is being loaded for real,
                    // the deregistration function changes from canceling registration to removal.
                    deregister = this.addEventListener(element, eventName, handler);
                }
            })
                .catch(() => {
                this.console.warn(`The "${eventName}" event cannot be bound because the custom ` +
                    `Hammer.JS loader failed.`);
                deregister = () => { };
            });
            // Return a function that *executes* `deregister` (and not `deregister` itself) so that we
            // can change the behavior of `deregister` once the listener is added. Using a closure in
            // this way allows us to avoid any additional data structures to track listener removal.
            return () => {
                deregister();
            };
        }
        return zone.runOutsideAngular(() => {
            // Creating the manager bind events, must be done outside of angular
            const mc = this._config.buildHammer(element);
            const callback = function (eventObj) {
                zone.runGuarded(function () {
                    handler(eventObj);
                });
            };
            mc.on(eventName, callback);
            return () => {
                mc.off(eventName, callback);
                // destroy mc to prevent memory leak
                if (typeof mc.destroy === 'function') {
                    mc.destroy();
                }
            };
        });
    }
    isCustomEvent(eventName) {
        return this._config.events.indexOf(eventName) > -1;
    }
}
HammerGesturesPlugin.decorators = [
    { type: Injectable }
];
HammerGesturesPlugin.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: HammerGestureConfig, decorators: [{ type: Inject, args: [HAMMER_GESTURE_CONFIG,] }] },
    { type: Console },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [HAMMER_LOADER,] }] }
];
/**
 * In Ivy, support for Hammer gestures is optional, so applications must
 * import the `HammerModule` at root to turn on support. This means that
 * Hammer-specific code can be tree-shaken away if not needed.
 */
export const HAMMER_PROVIDERS__POST_R3__ = [];
/**
 * In View Engine, support for Hammer gestures is built-in by default.
 */
export const HAMMER_PROVIDERS__PRE_R3__ = [
    {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: HammerGesturesPlugin,
        multi: true,
        deps: [DOCUMENT, HAMMER_GESTURE_CONFIG, Console, [new Optional(), HAMMER_LOADER]]
    },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig, deps: [] },
];
export const HAMMER_PROVIDERS = HAMMER_PROVIDERS__PRE_R3__;
/**
 * Adds support for HammerJS.
 *
 * Import this module at the root of your application so that Angular can work with
 * HammerJS to detect gesture events.
 *
 * Note that applications still need to include the HammerJS script itself. This module
 * simply sets up the coordination layer between HammerJS and Angular's EventManager.
 *
 * @publicApi
 */
export class HammerModule {
}
HammerModule.decorators = [
    { type: NgModule, args: [{ providers: HAMMER_PROVIDERS__PRE_R3__ },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyX2dlc3R1cmVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9zcmMvZG9tL2V2ZW50cy9oYW1tZXJfZ2VzdHVyZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFZLFFBQVEsSUFBSSxPQUFPLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFcEgsT0FBTyxFQUFDLHFCQUFxQixFQUFFLGtCQUFrQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFJMUU7O0dBRUc7QUFDSCxNQUFNLFdBQVcsR0FBRztJQUNsQixNQUFNO0lBQ04sS0FBSyxFQUFFLElBQUk7SUFDWCxVQUFVLEVBQUUsSUFBSTtJQUNoQixTQUFTLEVBQUUsSUFBSTtJQUNmLFFBQVEsRUFBRSxJQUFJO0lBQ2QsV0FBVyxFQUFFLElBQUk7SUFDakIsU0FBUyxFQUFFLElBQUk7SUFDZixVQUFVLEVBQUUsSUFBSTtJQUNoQixPQUFPLEVBQUUsSUFBSTtJQUNiLFNBQVMsRUFBRSxJQUFJO0lBQ2YsUUFBUTtJQUNSLE9BQU8sRUFBRSxJQUFJO0lBQ2IsWUFBWSxFQUFFLElBQUk7SUFDbEIsV0FBVyxFQUFFLElBQUk7SUFDakIsVUFBVSxFQUFFLElBQUk7SUFDaEIsYUFBYSxFQUFFLElBQUk7SUFDbkIsU0FBUyxFQUFFLElBQUk7SUFDZixVQUFVLEVBQUUsSUFBSTtJQUNoQixRQUFRO0lBQ1IsT0FBTyxFQUFFLElBQUk7SUFDYixTQUFTLEVBQUUsSUFBSTtJQUNmLFNBQVM7SUFDVCxRQUFRLEVBQUUsSUFBSTtJQUNkLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFlBQVksRUFBRSxJQUFJO0lBQ2xC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LEVBQUUsRUFBRSxFQUFDO0NBQzFFLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRywwQkFBMEIsQ0FBQztBQUUzRDs7Ozs7Ozs7OztHQVVHO0FBRUgsTUFBTSxPQUFPLFlBQVk7OztZQUR4QixRQUFRLFNBQUMsRUFBQyxTQUFTLEVBQUUsMEJBQTBCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgTmdNb2R1bGUsIE9wdGlvbmFsLCBQcm92aWRlciwgybVDb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0VWRU5UX01BTkFHRVJfUExVR0lOUywgRXZlbnRNYW5hZ2VyUGx1Z2lufSBmcm9tICcuL2V2ZW50X21hbmFnZXInO1xuXG5cblxuLyoqXG4gKiBTdXBwb3J0ZWQgSGFtbWVySlMgcmVjb2duaXplciBldmVudCBuYW1lcy5cbiAqL1xuY29uc3QgRVZFTlRfTkFNRVMgPSB7XG4gIC8vIHBhblxuICAncGFuJzogdHJ1ZSxcbiAgJ3BhbnN0YXJ0JzogdHJ1ZSxcbiAgJ3Bhbm1vdmUnOiB0cnVlLFxuICAncGFuZW5kJzogdHJ1ZSxcbiAgJ3BhbmNhbmNlbCc6IHRydWUsXG4gICdwYW5sZWZ0JzogdHJ1ZSxcbiAgJ3BhbnJpZ2h0JzogdHJ1ZSxcbiAgJ3BhbnVwJzogdHJ1ZSxcbiAgJ3BhbmRvd24nOiB0cnVlLFxuICAvLyBwaW5jaFxuICAncGluY2gnOiB0cnVlLFxuICAncGluY2hzdGFydCc6IHRydWUsXG4gICdwaW5jaG1vdmUnOiB0cnVlLFxuICAncGluY2hlbmQnOiB0cnVlLFxuICAncGluY2hjYW5jZWwnOiB0cnVlLFxuICAncGluY2hpbic6IHRydWUsXG4gICdwaW5jaG91dCc6IHRydWUsXG4gIC8vIHByZXNzXG4gICdwcmVzcyc6IHRydWUsXG4gICdwcmVzc3VwJzogdHJ1ZSxcbiAgLy8gcm90YXRlXG4gICdyb3RhdGUnOiB0cnVlLFxuICAncm90YXRlc3RhcnQnOiB0cnVlLFxuICAncm90YXRlbW92ZSc6IHRydWUsXG4gICdyb3RhdGVlbmQnOiB0cnVlLFxuICAncm90YXRlY2FuY2VsJzogdHJ1ZSxcbiAgLy8gc3dpcGVcbiAgJ3N3aXBlJzogdHJ1ZSxcbiAgJ3N3aXBlbGVmdCc6IHRydWUsXG4gICdzd2lwZXJpZ2h0JzogdHJ1ZSxcbiAgJ3N3aXBldXAnOiB0cnVlLFxuICAnc3dpcGVkb3duJzogdHJ1ZSxcbiAgLy8gdGFwXG4gICd0YXAnOiB0cnVlLFxufTtcblxuLyoqXG4gKiBESSB0b2tlbiBmb3IgcHJvdmlkaW5nIFtIYW1tZXJKU10oaHR0cHM6Ly9oYW1tZXJqcy5naXRodWIuaW8vKSBzdXBwb3J0IHRvIEFuZ3VsYXIuXG4gKiBAc2VlIGBIYW1tZXJHZXN0dXJlQ29uZmlnYFxuICpcbiAqIEBuZ01vZHVsZSBIYW1tZXJNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IEhBTU1FUl9HRVNUVVJFX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxIYW1tZXJHZXN0dXJlQ29uZmlnPignSGFtbWVyR2VzdHVyZUNvbmZpZycpO1xuXG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCBsb2FkcyBIYW1tZXJKUywgcmV0dXJuaW5nIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIG9uY2UgSGFtbWVySnMgaXMgbG9hZGVkLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgSGFtbWVyTG9hZGVyID0gKCkgPT4gUHJvbWlzZTx2b2lkPjtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdXNlZCB0byBwcm92aWRlIGEge0BsaW5rIEhhbW1lckxvYWRlcn0gdG8gQW5ndWxhci5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBIQU1NRVJfTE9BREVSID0gbmV3IEluamVjdGlvblRva2VuPEhhbW1lckxvYWRlcj4oJ0hhbW1lckxvYWRlcicpO1xuXG5leHBvcnQgaW50ZXJmYWNlIEhhbW1lckluc3RhbmNlIHtcbiAgb24oZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrPzogRnVuY3Rpb24pOiB2b2lkO1xuICBvZmYoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrPzogRnVuY3Rpb24pOiB2b2lkO1xuICBkZXN0cm95PygpOiB2b2lkO1xufVxuXG4vKipcbiAqIEFuIGluamVjdGFibGUgW0hhbW1lckpTIE1hbmFnZXJdKGh0dHBzOi8vaGFtbWVyanMuZ2l0aHViLmlvL2FwaS8jaGFtbWVybWFuYWdlcilcbiAqIGZvciBnZXN0dXJlIHJlY29nbml0aW9uLiBDb25maWd1cmVzIHNwZWNpZmljIGV2ZW50IHJlY29nbml0aW9uLlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSGFtbWVyR2VzdHVyZUNvbmZpZyB7XG4gIC8qKlxuICAgKiBBIHNldCBvZiBzdXBwb3J0ZWQgZXZlbnQgbmFtZXMgZm9yIGdlc3R1cmVzIHRvIGJlIHVzZWQgaW4gQW5ndWxhci5cbiAgICogQW5ndWxhciBzdXBwb3J0cyBhbGwgYnVpbHQtaW4gcmVjb2duaXplcnMsIGFzIGxpc3RlZCBpblxuICAgKiBbSGFtbWVySlMgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9oYW1tZXJqcy5naXRodWIuaW8vKS5cbiAgICovXG4gIGV2ZW50czogc3RyaW5nW10gPSBbXTtcblxuICAvKipcbiAgICogTWFwcyBnZXN0dXJlIGV2ZW50IG5hbWVzIHRvIGEgc2V0IG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiB0aGF0IHNwZWNpZnkgb3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHZhbHVlcyBmb3Igc3BlY2lmaWMgcHJvcGVydGllcy5cbiAgICpcbiAgICogVGhlIGtleSBpcyBhIHN1cHBvcnRlZCBldmVudCBuYW1lIHRvIGJlIGNvbmZpZ3VyZWQsXG4gICAqIGFuZCB0aGUgb3B0aW9ucyBvYmplY3QgY29udGFpbnMgYSBzZXQgb2YgcHJvcGVydGllcywgd2l0aCBvdmVycmlkZSB2YWx1ZXNcbiAgICogdG8gYmUgYXBwbGllZCB0byB0aGUgbmFtZWQgcmVjb2duaXplciBldmVudC5cbiAgICogRm9yIGV4YW1wbGUsIHRvIGRpc2FibGUgcmVjb2duaXRpb24gb2YgdGhlIHJvdGF0ZSBldmVudCwgc3BlY2lmeVxuICAgKiAgYHtcInJvdGF0ZVwiOiB7XCJlbmFibGVcIjogZmFsc2V9fWAuXG4gICAqXG4gICAqIFByb3BlcnRpZXMgdGhhdCBhcmUgbm90IHByZXNlbnQgdGFrZSB0aGUgSGFtbWVySlMgZGVmYXVsdCB2YWx1ZXMuXG4gICAqIEZvciBpbmZvcm1hdGlvbiBhYm91dCB3aGljaCBwcm9wZXJ0aWVzIGFyZSBzdXBwb3J0ZWQgZm9yIHdoaWNoIGV2ZW50cyxcbiAgICogYW5kIHRoZWlyIGFsbG93ZWQgYW5kIGRlZmF1bHQgdmFsdWVzLCBzZWVcbiAgICogW0hhbW1lckpTIGRvY3VtZW50YXRpb25dKGh0dHBzOi8vaGFtbWVyanMuZ2l0aHViLmlvLykuXG4gICAqXG4gICAqL1xuICBvdmVycmlkZXM6IHtba2V5OiBzdHJpbmddOiBPYmplY3R9ID0ge307XG5cbiAgLyoqXG4gICAqIFByb3BlcnRpZXMgd2hvc2UgZGVmYXVsdCB2YWx1ZXMgY2FuIGJlIG92ZXJyaWRkZW4gZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gICAqIERpZmZlcmVudCBzZXRzIG9mIHByb3BlcnRpZXMgYXBwbHkgdG8gZGlmZmVyZW50IGV2ZW50cy5cbiAgICogRm9yIGluZm9ybWF0aW9uIGFib3V0IHdoaWNoIHByb3BlcnRpZXMgYXJlIHN1cHBvcnRlZCBmb3Igd2hpY2ggZXZlbnRzLFxuICAgKiBhbmQgdGhlaXIgYWxsb3dlZCBhbmQgZGVmYXVsdCB2YWx1ZXMsIHNlZVxuICAgKiBbSGFtbWVySlMgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9oYW1tZXJqcy5naXRodWIuaW8vKS5cbiAgICovXG4gIG9wdGlvbnM/OiB7XG4gICAgY3NzUHJvcHM/OiBhbnk7XG4gICAgZG9tRXZlbnRzPzogYm9vbGVhbjtcbiAgICBlbmFibGU/OiBib29sZWFuIHwgKChtYW5hZ2VyOiBhbnkpID0+IGJvb2xlYW4pO1xuICAgIHByZXNldD86IGFueVtdO1xuICAgIHRvdWNoQWN0aW9uPzogc3RyaW5nO1xuICAgIHJlY29nbml6ZXJzPzogYW55W107XG4gICAgaW5wdXRDbGFzcz86IGFueTtcbiAgICBpbnB1dFRhcmdldD86IEV2ZW50VGFyZ2V0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgW0hhbW1lckpTIE1hbmFnZXJdKGh0dHBzOi8vaGFtbWVyanMuZ2l0aHViLmlvL2FwaS8jaGFtbWVybWFuYWdlcilcbiAgICogYW5kIGF0dGFjaGVzIGl0IHRvIGEgZ2l2ZW4gSFRNTCBlbGVtZW50LlxuICAgKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgcmVjb2duaXplIGdlc3R1cmVzLlxuICAgKiBAcmV0dXJucyBBIEhhbW1lckpTIGV2ZW50LW1hbmFnZXIgb2JqZWN0LlxuICAgKi9cbiAgYnVpbGRIYW1tZXIoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIYW1tZXJJbnN0YW5jZSB7XG4gICAgY29uc3QgbWMgPSBuZXcgSGFtbWVyIShlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgbWMuZ2V0KCdwaW5jaCcpLnNldCh7ZW5hYmxlOiB0cnVlfSk7XG4gICAgbWMuZ2V0KCdyb3RhdGUnKS5zZXQoe2VuYWJsZTogdHJ1ZX0pO1xuXG4gICAgZm9yIChjb25zdCBldmVudE5hbWUgaW4gdGhpcy5vdmVycmlkZXMpIHtcbiAgICAgIG1jLmdldChldmVudE5hbWUpLnNldCh0aGlzLm92ZXJyaWRlc1tldmVudE5hbWVdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWM7XG4gIH1cbn1cblxuLyoqXG4gKiBFdmVudCBwbHVnaW4gdGhhdCBhZGRzIEhhbW1lciBzdXBwb3J0IHRvIGFuIGFwcGxpY2F0aW9uLlxuICpcbiAqIEBuZ01vZHVsZSBIYW1tZXJNb2R1bGVcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEhhbW1lckdlc3R1cmVzUGx1Z2luIGV4dGVuZHMgRXZlbnRNYW5hZ2VyUGx1Z2luIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2M6IGFueSxcbiAgICAgIEBJbmplY3QoSEFNTUVSX0dFU1RVUkVfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IEhhbW1lckdlc3R1cmVDb25maWcsIHByaXZhdGUgY29uc29sZTogQ29uc29sZSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoSEFNTUVSX0xPQURFUikgcHJpdmF0ZSBsb2FkZXI/OiBIYW1tZXJMb2FkZXJ8bnVsbCkge1xuICAgIHN1cGVyKGRvYyk7XG4gIH1cblxuICBzdXBwb3J0cyhldmVudE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghRVZFTlRfTkFNRVMuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lLnRvTG93ZXJDYXNlKCkpICYmICF0aGlzLmlzQ3VzdG9tRXZlbnQoZXZlbnROYW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghKHdpbmRvdyBhcyBhbnkpLkhhbW1lciAmJiAhdGhpcy5sb2FkZXIpIHtcbiAgICAgIHRoaXMuY29uc29sZS53YXJuKFxuICAgICAgICAgIGBUaGUgXCIke2V2ZW50TmFtZX1cIiBldmVudCBjYW5ub3QgYmUgYm91bmQgYmVjYXVzZSBIYW1tZXIuSlMgaXMgbm90IGAgK1xuICAgICAgICAgIGBsb2FkZWQgYW5kIG5vIGN1c3RvbSBsb2FkZXIgaGFzIGJlZW4gc3BlY2lmaWVkLmApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBIVE1MRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIGNvbnN0IHpvbmUgPSB0aGlzLm1hbmFnZXIuZ2V0Wm9uZSgpO1xuICAgIGV2ZW50TmFtZSA9IGV2ZW50TmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gSWYgSGFtbWVyIGlzIG5vdCBwcmVzZW50IGJ1dCBhIGxvYWRlciBpcyBzcGVjaWZpZWQsIHdlIGRlZmVyIGFkZGluZyB0aGUgZXZlbnQgbGlzdGVuZXJcbiAgICAvLyB1bnRpbCBIYW1tZXIgaXMgbG9hZGVkLlxuICAgIGlmICghKHdpbmRvdyBhcyBhbnkpLkhhbW1lciAmJiB0aGlzLmxvYWRlcikge1xuICAgICAgLy8gVGhpcyBgYWRkRXZlbnRMaXN0ZW5lcmAgbWV0aG9kIHJldHVybnMgYSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGFkZGVkIGxpc3RlbmVyLlxuICAgICAgLy8gVW50aWwgSGFtbWVyIGlzIGxvYWRlZCwgdGhlIHJldHVybmVkIGZ1bmN0aW9uIG5lZWRzIHRvICpjYW5jZWwqIHRoZSByZWdpc3RyYXRpb24gcmF0aGVyXG4gICAgICAvLyB0aGFuIHJlbW92ZSBhbnl0aGluZy5cbiAgICAgIGxldCBjYW5jZWxSZWdpc3RyYXRpb24gPSBmYWxzZTtcbiAgICAgIGxldCBkZXJlZ2lzdGVyOiBGdW5jdGlvbiA9ICgpID0+IHtcbiAgICAgICAgY2FuY2VsUmVnaXN0cmF0aW9uID0gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMubG9hZGVyKClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBJZiBIYW1tZXIgaXNuJ3QgYWN0dWFsbHkgbG9hZGVkIHdoZW4gdGhlIGN1c3RvbSBsb2FkZXIgcmVzb2x2ZXMsIGdpdmUgdXAuXG4gICAgICAgICAgICBpZiAoISh3aW5kb3cgYXMgYW55KS5IYW1tZXIpIHtcbiAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgICBgVGhlIGN1c3RvbSBIQU1NRVJfTE9BREVSIGNvbXBsZXRlZCwgYnV0IEhhbW1lci5KUyBpcyBub3QgcHJlc2VudC5gKTtcbiAgICAgICAgICAgICAgZGVyZWdpc3RlciA9ICgpID0+IHt9O1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY2FuY2VsUmVnaXN0cmF0aW9uKSB7XG4gICAgICAgICAgICAgIC8vIE5vdyB0aGF0IEhhbW1lciBpcyBsb2FkZWQgYW5kIHRoZSBsaXN0ZW5lciBpcyBiZWluZyBsb2FkZWQgZm9yIHJlYWwsXG4gICAgICAgICAgICAgIC8vIHRoZSBkZXJlZ2lzdHJhdGlvbiBmdW5jdGlvbiBjaGFuZ2VzIGZyb20gY2FuY2VsaW5nIHJlZ2lzdHJhdGlvbiB0byByZW1vdmFsLlxuICAgICAgICAgICAgICBkZXJlZ2lzdGVyID0gdGhpcy5hZGRFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgYFRoZSBcIiR7ZXZlbnROYW1lfVwiIGV2ZW50IGNhbm5vdCBiZSBib3VuZCBiZWNhdXNlIHRoZSBjdXN0b20gYCArXG4gICAgICAgICAgICAgICAgYEhhbW1lci5KUyBsb2FkZXIgZmFpbGVkLmApO1xuICAgICAgICAgICAgZGVyZWdpc3RlciA9ICgpID0+IHt9O1xuICAgICAgICAgIH0pO1xuXG4gICAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0ICpleGVjdXRlcyogYGRlcmVnaXN0ZXJgIChhbmQgbm90IGBkZXJlZ2lzdGVyYCBpdHNlbGYpIHNvIHRoYXQgd2VcbiAgICAgIC8vIGNhbiBjaGFuZ2UgdGhlIGJlaGF2aW9yIG9mIGBkZXJlZ2lzdGVyYCBvbmNlIHRoZSBsaXN0ZW5lciBpcyBhZGRlZC4gVXNpbmcgYSBjbG9zdXJlIGluXG4gICAgICAvLyB0aGlzIHdheSBhbGxvd3MgdXMgdG8gYXZvaWQgYW55IGFkZGl0aW9uYWwgZGF0YSBzdHJ1Y3R1cmVzIHRvIHRyYWNrIGxpc3RlbmVyIHJlbW92YWwuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBkZXJlZ2lzdGVyKCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIC8vIENyZWF0aW5nIHRoZSBtYW5hZ2VyIGJpbmQgZXZlbnRzLCBtdXN0IGJlIGRvbmUgb3V0c2lkZSBvZiBhbmd1bGFyXG4gICAgICBjb25zdCBtYyA9IHRoaXMuX2NvbmZpZy5idWlsZEhhbW1lcihlbGVtZW50KTtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gZnVuY3Rpb24oZXZlbnRPYmo6IEhhbW1lcklucHV0KSB7XG4gICAgICAgIHpvbmUucnVuR3VhcmRlZChmdW5jdGlvbigpIHtcbiAgICAgICAgICBoYW5kbGVyKGV2ZW50T2JqKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgbWMub24oZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBtYy5vZmYoZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgICAgIC8vIGRlc3Ryb3kgbWMgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgICAgICBpZiAodHlwZW9mIG1jLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBtYy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBpc0N1c3RvbUV2ZW50KGV2ZW50TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5ldmVudHMuaW5kZXhPZihldmVudE5hbWUpID4gLTE7XG4gIH1cbn1cblxuLyoqXG4gKiBJbiBJdnksIHN1cHBvcnQgZm9yIEhhbW1lciBnZXN0dXJlcyBpcyBvcHRpb25hbCwgc28gYXBwbGljYXRpb25zIG11c3RcbiAqIGltcG9ydCB0aGUgYEhhbW1lck1vZHVsZWAgYXQgcm9vdCB0byB0dXJuIG9uIHN1cHBvcnQuIFRoaXMgbWVhbnMgdGhhdFxuICogSGFtbWVyLXNwZWNpZmljIGNvZGUgY2FuIGJlIHRyZWUtc2hha2VuIGF3YXkgaWYgbm90IG5lZWRlZC5cbiAqL1xuZXhwb3J0IGNvbnN0IEhBTU1FUl9QUk9WSURFUlNfX1BPU1RfUjNfXyA9IFtdO1xuXG4vKipcbiAqIEluIFZpZXcgRW5naW5lLCBzdXBwb3J0IGZvciBIYW1tZXIgZ2VzdHVyZXMgaXMgYnVpbHQtaW4gYnkgZGVmYXVsdC5cbiAqL1xuZXhwb3J0IGNvbnN0IEhBTU1FUl9QUk9WSURFUlNfX1BSRV9SM19fOiBQcm92aWRlcltdID0gW1xuICB7XG4gICAgcHJvdmlkZTogRVZFTlRfTUFOQUdFUl9QTFVHSU5TLFxuICAgIHVzZUNsYXNzOiBIYW1tZXJHZXN0dXJlc1BsdWdpbixcbiAgICBtdWx0aTogdHJ1ZSxcbiAgICBkZXBzOiBbRE9DVU1FTlQsIEhBTU1FUl9HRVNUVVJFX0NPTkZJRywgQ29uc29sZSwgW25ldyBPcHRpb25hbCgpLCBIQU1NRVJfTE9BREVSXV1cbiAgfSxcbiAge3Byb3ZpZGU6IEhBTU1FUl9HRVNUVVJFX0NPTkZJRywgdXNlQ2xhc3M6IEhhbW1lckdlc3R1cmVDb25maWcsIGRlcHM6IFtdfSxcbl07XG5cbmV4cG9ydCBjb25zdCBIQU1NRVJfUFJPVklERVJTID0gSEFNTUVSX1BST1ZJREVSU19fUFJFX1IzX187XG5cbi8qKlxuICogQWRkcyBzdXBwb3J0IGZvciBIYW1tZXJKUy5cbiAqXG4gKiBJbXBvcnQgdGhpcyBtb2R1bGUgYXQgdGhlIHJvb3Qgb2YgeW91ciBhcHBsaWNhdGlvbiBzbyB0aGF0IEFuZ3VsYXIgY2FuIHdvcmsgd2l0aFxuICogSGFtbWVySlMgdG8gZGV0ZWN0IGdlc3R1cmUgZXZlbnRzLlxuICpcbiAqIE5vdGUgdGhhdCBhcHBsaWNhdGlvbnMgc3RpbGwgbmVlZCB0byBpbmNsdWRlIHRoZSBIYW1tZXJKUyBzY3JpcHQgaXRzZWxmLiBUaGlzIG1vZHVsZVxuICogc2ltcGx5IHNldHMgdXAgdGhlIGNvb3JkaW5hdGlvbiBsYXllciBiZXR3ZWVuIEhhbW1lckpTIGFuZCBBbmd1bGFyJ3MgRXZlbnRNYW5hZ2VyLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKHtwcm92aWRlcnM6IEhBTU1FUl9QUk9WSURFUlNfX1BSRV9SM19ffSlcbmV4cG9ydCBjbGFzcyBIYW1tZXJNb2R1bGUge1xufVxuIl19