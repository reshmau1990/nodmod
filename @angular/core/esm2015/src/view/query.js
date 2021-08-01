/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef } from '../linker/element_ref';
import { QueryList } from '../linker/query_list';
import { asElementData, asProviderData, asQueryList } from './types';
import { declaredViewContainer, filterQueryId, isEmbeddedView } from './util';
export function queryDef(flags, id, bindings) {
    let bindingDefs = [];
    for (let propName in bindings) {
        const bindingType = bindings[propName];
        bindingDefs.push({ propName, bindingType });
    }
    return {
        // will bet set by the view definition
        nodeIndex: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        // TODO(vicb): check
        checkIndex: -1,
        flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        ngContentIndex: -1,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {},
        childCount: 0,
        bindings: [],
        bindingFlags: 0,
        outputs: [],
        element: null,
        provider: null,
        text: null,
        query: { id, filterId: filterQueryId(id), bindings: bindingDefs },
        ngContent: null
    };
}
export function createQuery() {
    return new QueryList();
}
export function dirtyParentQueries(view) {
    const queryIds = view.def.nodeMatchedQueries;
    while (view.parent && isEmbeddedView(view)) {
        let tplDef = view.parentNodeDef;
        view = view.parent;
        // content queries
        const end = tplDef.nodeIndex + tplDef.childCount;
        for (let i = 0; i <= end; i++) {
            const nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & 67108864 /* TypeContentQuery */) &&
                (nodeDef.flags & 536870912 /* DynamicQuery */) &&
                (nodeDef.query.filterId & queryIds) === nodeDef.query.filterId) {
                asQueryList(view, i).setDirty();
            }
            if ((nodeDef.flags & 1 /* TypeElement */ && i + nodeDef.childCount < tplDef.nodeIndex) ||
                !(nodeDef.childFlags & 67108864 /* TypeContentQuery */) ||
                !(nodeDef.childFlags & 536870912 /* DynamicQuery */)) {
                // skip elements that don't contain the template element or no query.
                i += nodeDef.childCount;
            }
        }
    }
    // view queries
    if (view.def.nodeFlags & 134217728 /* TypeViewQuery */) {
        for (let i = 0; i < view.def.nodes.length; i++) {
            const nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & 134217728 /* TypeViewQuery */) && (nodeDef.flags & 536870912 /* DynamicQuery */)) {
                asQueryList(view, i).setDirty();
            }
            // only visit the root nodes
            i += nodeDef.childCount;
        }
    }
}
export function checkAndUpdateQuery(view, nodeDef) {
    const queryList = asQueryList(view, nodeDef.nodeIndex);
    if (!queryList.dirty) {
        return;
    }
    let directiveInstance;
    let newValues = undefined;
    if (nodeDef.flags & 67108864 /* TypeContentQuery */) {
        const elementDef = nodeDef.parent.parent;
        newValues = calcQueryValues(view, elementDef.nodeIndex, elementDef.nodeIndex + elementDef.childCount, nodeDef.query, []);
        directiveInstance = asProviderData(view, nodeDef.parent.nodeIndex).instance;
    }
    else if (nodeDef.flags & 134217728 /* TypeViewQuery */) {
        newValues = calcQueryValues(view, 0, view.def.nodes.length - 1, nodeDef.query, []);
        directiveInstance = view.component;
    }
    queryList.reset(newValues);
    const bindings = nodeDef.query.bindings;
    let notify = false;
    for (let i = 0; i < bindings.length; i++) {
        const binding = bindings[i];
        let boundValue;
        switch (binding.bindingType) {
            case 0 /* First */:
                boundValue = queryList.first;
                break;
            case 1 /* All */:
                boundValue = queryList;
                notify = true;
                break;
        }
        directiveInstance[binding.propName] = boundValue;
    }
    if (notify) {
        queryList.notifyOnChanges();
    }
}
function calcQueryValues(view, startIndex, endIndex, queryDef, values) {
    for (let i = startIndex; i <= endIndex; i++) {
        const nodeDef = view.def.nodes[i];
        const valueType = nodeDef.matchedQueries[queryDef.id];
        if (valueType != null) {
            values.push(getQueryValue(view, nodeDef, valueType));
        }
        if (nodeDef.flags & 1 /* TypeElement */ && nodeDef.element.template &&
            (nodeDef.element.template.nodeMatchedQueries & queryDef.filterId) ===
                queryDef.filterId) {
            const elementData = asElementData(view, i);
            // check embedded views that were attached at the place of their template,
            // but process child nodes first if some match the query (see issue #16568)
            if ((nodeDef.childMatchedQueries & queryDef.filterId) === queryDef.filterId) {
                calcQueryValues(view, i + 1, i + nodeDef.childCount, queryDef, values);
                i += nodeDef.childCount;
            }
            if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
                const embeddedViews = elementData.viewContainer._embeddedViews;
                for (let k = 0; k < embeddedViews.length; k++) {
                    const embeddedView = embeddedViews[k];
                    const dvc = declaredViewContainer(embeddedView);
                    if (dvc && dvc === elementData) {
                        calcQueryValues(embeddedView, 0, embeddedView.def.nodes.length - 1, queryDef, values);
                    }
                }
            }
            const projectedViews = elementData.template._projectedViews;
            if (projectedViews) {
                for (let k = 0; k < projectedViews.length; k++) {
                    const projectedView = projectedViews[k];
                    calcQueryValues(projectedView, 0, projectedView.def.nodes.length - 1, queryDef, values);
                }
            }
        }
        if ((nodeDef.childMatchedQueries & queryDef.filterId) !== queryDef.filterId) {
            // if no child matches the query, skip the children.
            i += nodeDef.childCount;
        }
    }
    return values;
}
export function getQueryValue(view, nodeDef, queryValueType) {
    if (queryValueType != null) {
        // a match
        switch (queryValueType) {
            case 1 /* RenderElement */:
                return asElementData(view, nodeDef.nodeIndex).renderElement;
            case 0 /* ElementRef */:
                return new ElementRef(asElementData(view, nodeDef.nodeIndex).renderElement);
            case 2 /* TemplateRef */:
                return asElementData(view, nodeDef.nodeIndex).template;
            case 3 /* ViewContainerRef */:
                return asElementData(view, nodeDef.nodeIndex).viewContainer;
            case 4 /* Provider */:
                return asProviderData(view, nodeDef.nodeIndex).instance;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L3F1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFL0MsT0FBTyxFQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUE0RixNQUFNLFNBQVMsQ0FBQztBQUM5SixPQUFPLEVBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUU1RSxNQUFNLFVBQVUsUUFBUSxDQUNwQixLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFnRDtJQUNoRixJQUFJLFdBQVcsR0FBc0IsRUFBRSxDQUFDO0lBQ3hDLEtBQUssSUFBSSxRQUFRLElBQUksUUFBUSxFQUFFO1FBQzdCLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7S0FDM0M7SUFFRCxPQUFPO1FBQ0wsc0NBQXNDO1FBQ3RDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDYixNQUFNLEVBQUUsSUFBSTtRQUNaLFlBQVksRUFBRSxJQUFJO1FBQ2xCLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDaEIsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNmLGlCQUFpQjtRQUNqQixvQkFBb0I7UUFDcEIsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNkLEtBQUs7UUFDTCxVQUFVLEVBQUUsQ0FBQztRQUNiLGdCQUFnQixFQUFFLENBQUM7UUFDbkIsbUJBQW1CLEVBQUUsQ0FBQztRQUN0QixjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2xCLGNBQWMs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QWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RWxlbWVudFJlZn0gZnJvbSAnLi4vbGlua2VyL2VsZW1lbnRfcmVmJztcbmltcG9ydCB7UXVlcnlMaXN0fSBmcm9tICcuLi9saW5rZXIvcXVlcnlfbGlzdCc7XG5cbmltcG9ydCB7YXNFbGVtZW50RGF0YSwgYXNQcm92aWRlckRhdGEsIGFzUXVlcnlMaXN0LCBOb2RlRGVmLCBOb2RlRmxhZ3MsIFF1ZXJ5QmluZGluZ0RlZiwgUXVlcnlCaW5kaW5nVHlwZSwgUXVlcnlEZWYsIFF1ZXJ5VmFsdWVUeXBlLCBWaWV3RGF0YX0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge2RlY2xhcmVkVmlld0NvbnRhaW5lciwgZmlsdGVyUXVlcnlJZCwgaXNFbWJlZGRlZFZpZXd9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBxdWVyeURlZihcbiAgICBmbGFnczogTm9kZUZsYWdzLCBpZDogbnVtYmVyLCBiaW5kaW5nczoge1twcm9wTmFtZTogc3RyaW5nXTogUXVlcnlCaW5kaW5nVHlwZX0pOiBOb2RlRGVmIHtcbiAgbGV0IGJpbmRpbmdEZWZzOiBRdWVyeUJpbmRpbmdEZWZbXSA9IFtdO1xuICBmb3IgKGxldCBwcm9wTmFtZSBpbiBiaW5kaW5ncykge1xuICAgIGNvbnN0IGJpbmRpbmdUeXBlID0gYmluZGluZ3NbcHJvcE5hbWVdO1xuICAgIGJpbmRpbmdEZWZzLnB1c2goe3Byb3BOYW1lLCBiaW5kaW5nVHlwZX0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvLyB3aWxsIGJldCBzZXQgYnkgdGhlIHZpZXcgZGVmaW5pdGlvblxuICAgIG5vZGVJbmRleDogLTEsXG4gICAgcGFyZW50OiBudWxsLFxuICAgIHJlbmRlclBhcmVudDogbnVsbCxcbiAgICBiaW5kaW5nSW5kZXg6IC0xLFxuICAgIG91dHB1dEluZGV4OiAtMSxcbiAgICAvLyByZWd1bGFyIHZhbHVlc1xuICAgIC8vIFRPRE8odmljYik6IGNoZWNrXG4gICAgY2hlY2tJbmRleDogLTEsXG4gICAgZmxhZ3MsXG4gICAgY2hpbGRGbGFnczogMCxcbiAgICBkaXJlY3RDaGlsZEZsYWdzOiAwLFxuICAgIGNoaWxkTWF0Y2hlZFF1ZXJpZXM6IDAsXG4gICAgbmdDb250ZW50SW5kZXg6IC0xLFxuICAgIG1hdGNoZWRRdWVyaWVzOiB7fSxcbiAgICBtYXRjaGVkUXVlcnlJZHM6IDAsXG4gICAgcmVmZXJlbmNlczoge30sXG4gICAgY2hpbGRDb3VudDogMCxcbiAgICBiaW5kaW5nczogW10sXG4gICAgYmluZGluZ0ZsYWdzOiAwLFxuICAgIG91dHB1dHM6IFtdLFxuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgcHJvdmlkZXI6IG51bGwsXG4gICAgdGV4dDogbnVsbCxcbiAgICBxdWVyeToge2lkLCBmaWx0ZXJJZDogZmlsdGVyUXVlcnlJZChpZCksIGJpbmRpbmdzOiBiaW5kaW5nRGVmc30sXG4gICAgbmdDb250ZW50OiBudWxsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVRdWVyeSgpOiBRdWVyeUxpc3Q8YW55PiB7XG4gIHJldHVybiBuZXcgUXVlcnlMaXN0KCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXJ0eVBhcmVudFF1ZXJpZXModmlldzogVmlld0RhdGEpIHtcbiAgY29uc3QgcXVlcnlJZHMgPSB2aWV3LmRlZi5ub2RlTWF0Y2hlZFF1ZXJpZXM7XG4gIHdoaWxlICh2aWV3LnBhcmVudCAmJiBpc0VtYmVkZGVkVmlldyh2aWV3KSkge1xuICAgIGxldCB0cGxEZWYgPSB2aWV3LnBhcmVudE5vZGVEZWYhO1xuICAgIHZpZXcgPSB2aWV3LnBhcmVudDtcbiAgICAvLyBjb250ZW50IHF1ZXJpZXNcbiAgICBjb25zdCBlbmQgPSB0cGxEZWYubm9kZUluZGV4ICsgdHBsRGVmLmNoaWxkQ291bnQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGVEZWYgPSB2aWV3LmRlZi5ub2Rlc1tpXTtcbiAgICAgIGlmICgobm9kZURlZi5mbGFncyAmIE5vZGVGbGFncy5UeXBlQ29udGVudFF1ZXJ5KSAmJlxuICAgICAgICAgIChub2RlRGVmLmZsYWdzICYgTm9kZUZsYWdzLkR5bmFtaWNRdWVyeSkgJiZcbiAgICAgICAgICAobm9kZURlZi5xdWVyeSEuZmlsdGVySWQgJiBxdWVyeUlkcykgPT09IG5vZGVEZWYucXVlcnkhLmZpbHRlcklkKSB7XG4gICAgICAgIGFzUXVlcnlMaXN0KHZpZXcsIGkpLnNldERpcnR5KCk7XG4gICAgICB9XG4gICAgICBpZiAoKG5vZGVEZWYuZmxhZ3MgJiBOb2RlRmxhZ3MuVHlwZUVsZW1lbnQgJiYgaSArIG5vZGVEZWYuY2hpbGRDb3VudCA8IHRwbERlZi5ub2RlSW5kZXgpIHx8XG4gICAgICAgICAgIShub2RlRGVmLmNoaWxkRmxhZ3MgJiBOb2RlRmxhZ3MuVHlwZUNvbnRlbnRRdWVyeSkgfHxcbiAgICAgICAgICAhKG5vZGVEZWYuY2hpbGRGbGFncyAmIE5vZGVGbGFncy5EeW5hbWljUXVlcnkpKSB7XG4gICAgICAgIC8vIHNraXAgZWxlbWVudHMgdGhhdCBkb24ndCBjb250YWluIHRoZSB0ZW1wbGF0ZSBlbGVtZW50IG9yIG5vIHF1ZXJ5LlxuICAgICAgICBpICs9IG5vZGVEZWYuY2hpbGRDb3VudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyB2aWV3IHF1ZXJpZXNcbiAgaWYgKHZpZXcuZGVmLm5vZGVGbGFncyAmIE5vZGVGbGFncy5UeXBlVmlld1F1ZXJ5KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aWV3LmRlZi5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgbm9kZURlZiA9IHZpZXcuZGVmLm5vZGVzW2ldO1xuICAgICAgaWYgKChub2RlRGVmLmZsYWdzICYgTm9kZUZsYWdzLlR5cGVWaWV3UXVlcnkpICYmIChub2RlRGVmLmZsYWdzICYgTm9kZUZsYWdzLkR5bmFtaWNRdWVyeSkpIHtcbiAgICAgICAgYXNRdWVyeUxpc3QodmlldywgaSkuc2V0RGlydHkoKTtcbiAgICAgIH1cbiAgICAgIC8vIG9ubHkgdmlzaXQgdGhlIHJvb3Qgbm9kZXNcbiAgICAgIGkgKz0gbm9kZURlZi5jaGlsZENvdW50O1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tBbmRVcGRhdGVRdWVyeSh2aWV3OiBWaWV3RGF0YSwgbm9kZURlZjogTm9kZURlZikge1xuICBjb25zdCBxdWVyeUxpc3QgPSBhc1F1ZXJ5TGlzdCh2aWV3LCBub2RlRGVmLm5vZGVJbmRleCk7XG4gIGlmICghcXVlcnlMaXN0LmRpcnR5KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBkaXJlY3RpdmVJbnN0YW5jZTogYW55O1xuICBsZXQgbmV3VmFsdWVzOiBhbnlbXSA9IHVuZGVmaW5lZCE7XG4gIGlmIChub2RlRGVmLmZsYWdzICYgTm9kZUZsYWdzLlR5cGVDb250ZW50UXVlcnkpIHtcbiAgICBjb25zdCBlbGVtZW50RGVmID0gbm9kZURlZi5wYXJlbnQhLnBhcmVudCE7XG4gICAgbmV3VmFsdWVzID0gY2FsY1F1ZXJ5VmFsdWVzKFxuICAgICAgICB2aWV3LCBlbGVtZW50RGVmLm5vZGVJbmRleCwgZWxlbWVudERlZi5ub2RlSW5kZXggKyBlbGVtZW50RGVmLmNoaWxkQ291bnQsIG5vZGVEZWYucXVlcnkhLFxuICAgICAgICBbXSk7XG4gICAgZGlyZWN0aXZlSW5zdGFuY2UgPSBhc1Byb3ZpZGVyRGF0YSh2aWV3LCBub2RlRGVmLnBhcmVudCEubm9kZUluZGV4KS5pbnN0YW5jZTtcbiAgfSBlbHNlIGlmIChub2RlRGVmLmZsYWdzICYgTm9kZUZsYWdzLlR5cGVWaWV3UXVlcnkpIHtcbiAgICBuZXdWYWx1ZXMgPSBjYWxjUXVlcnlWYWx1ZXModmlldywgMCwgdmlldy5kZWYubm9kZXMubGVuZ3RoIC0gMSwgbm9kZURlZi5xdWVyeSEsIFtdKTtcbiAgICBkaXJlY3RpdmVJbnN0YW5jZSA9IHZpZXcuY29tcG9uZW50O1xuICB9XG4gIHF1ZXJ5TGlzdC5yZXNldChuZXdWYWx1ZXMpO1xuICBjb25zdCBiaW5kaW5ncyA9IG5vZGVEZWYucXVlcnkhLmJpbmRpbmdzO1xuICBsZXQgbm90aWZ5ID0gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYmluZGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBiaW5kaW5nID0gYmluZGluZ3NbaV07XG4gICAgbGV0IGJvdW5kVmFsdWU6IGFueTtcbiAgICBzd2l0Y2ggKGJpbmRpbmcuYmluZGluZ1R5cGUpIHtcbiAgICAgIGNhc2UgUXVlcnlCaW5kaW5nVHlwZS5GaXJzdDpcbiAgICAgICAgYm91bmRWYWx1ZSA9IHF1ZXJ5TGlzdC5maXJzdDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFF1ZXJ5QmluZGluZ1R5cGUuQWxsOlxuICAgICAgICBib3VuZFZhbHVlID0gcXVlcnlMaXN0O1xuICAgICAgICBub3RpZnkgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgZGlyZWN0aXZlSW5zdGFuY2VbYmluZGluZy5wcm9wTmFtZV0gPSBib3VuZFZhbHVlO1xuICB9XG4gIGlmIChub3RpZnkpIHtcbiAgICBxdWVyeUxpc3Qubm90aWZ5T25DaGFuZ2VzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsY1F1ZXJ5VmFsdWVzKFxuICAgIHZpZXc6IFZpZXdEYXRhLCBzdGFydEluZGV4OiBudW1iZXIsIGVuZEluZGV4OiBudW1iZXIsIHF1ZXJ5RGVmOiBRdWVyeURlZixcbiAgICB2YWx1ZXM6IGFueVtdKTogYW55W10ge1xuICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8PSBlbmRJbmRleDsgaSsrKSB7XG4gICAgY29uc3Qgbm9kZURlZiA9IHZpZXcuZGVmLm5vZGVzW2ldO1xuICAgIGNvbnN0IHZhbHVlVHlwZSA9IG5vZGVEZWYubWF0Y2hlZFF1ZXJpZXNbcXVlcnlEZWYuaWRdO1xuICAgIGlmICh2YWx1ZVR5cGUgIT0gbnVsbCkge1xuICAgICAgdmFsdWVzLnB1c2goZ2V0UXVlcnlWYWx1ZSh2aWV3LCBub2RlRGVmLCB2YWx1ZVR5cGUpKTtcbiAgICB9XG4gICAgaWYgKG5vZGVEZWYuZmxhZ3MgJiBOb2RlRmxhZ3MuVHlwZUVsZW1lbnQgJiYgbm9kZURlZi5lbGVtZW50IS50ZW1wbGF0ZSAmJlxuICAgICAgICAobm9kZURlZi5lbGVtZW50IS50ZW1wbGF0ZSAhLm5vZGVNYXRjaGVkUXVlcmllcyAmIHF1ZXJ5RGVmLmZpbHRlcklkKSA9PT1cbiAgICAgICAgICAgIHF1ZXJ5RGVmLmZpbHRlcklkKSB7XG4gICAgICBjb25zdCBlbGVtZW50RGF0YSA9IGFzRWxlbWVudERhdGEodmlldywgaSk7XG4gICAgICAvLyBjaGVjayBlbWJlZGRlZCB2aWV3cyB0aGF0IHdlcmUgYXR0YWNoZWQgYXQgdGhlIHBsYWNlIG9mIHRoZWlyIHRlbXBsYXRlLFxuICAgICAgLy8gYnV0IHByb2Nlc3MgY2hpbGQgbm9kZXMgZmlyc3QgaWYgc29tZSBtYXRjaCB0aGUgcXVlcnkgKHNlZSBpc3N1ZSAjMTY1NjgpXG4gICAgICBpZiAoKG5vZGVEZWYuY2hpbGRNYXRjaGVkUXVlcmllcyAmIHF1ZXJ5RGVmLmZpbHRlcklkKSA9PT0gcXVlcnlEZWYuZmlsdGVySWQpIHtcbiAgICAgICAgY2FsY1F1ZXJ5VmFsdWVzKHZpZXcsIGkgKyAxLCBpICsgbm9kZURlZi5jaGlsZENvdW50LCBxdWVyeURlZiwgdmFsdWVzKTtcbiAgICAgICAgaSArPSBub2RlRGVmLmNoaWxkQ291bnQ7XG4gICAgICB9XG4gICAgICBpZiAobm9kZURlZi5mbGFncyAmIE5vZGVGbGFncy5FbWJlZGRlZFZpZXdzKSB7XG4gICAgICAgIGNvbnN0IGVtYmVkZGVkVmlld3MgPSBlbGVtZW50RGF0YS52aWV3Q29udGFpbmVyIS5fZW1iZWRkZWRWaWV3cztcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBlbWJlZGRlZFZpZXdzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgY29uc3QgZW1iZWRkZWRWaWV3ID0gZW1iZWRkZWRWaWV3c1trXTtcbiAgICAgICAgICBjb25zdCBkdmMgPSBkZWNsYXJlZFZpZXdDb250YWluZXIoZW1iZWRkZWRWaWV3KTtcbiAgICAgICAgICBpZiAoZHZjICYmIGR2YyA9PT0gZWxlbWVudERhdGEpIHtcbiAgICAgICAgICAgIGNhbGNRdWVyeVZhbHVlcyhlbWJlZGRlZFZpZXcsIDAsIGVtYmVkZGVkVmlldy5kZWYubm9kZXMubGVuZ3RoIC0gMSwgcXVlcnlEZWYsIHZhbHVlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBwcm9qZWN0ZWRWaWV3cyA9IGVsZW1lbnREYXRhLnRlbXBsYXRlLl9wcm9qZWN0ZWRWaWV3cztcbiAgICAgIGlmIChwcm9qZWN0ZWRWaWV3cykge1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHByb2plY3RlZFZpZXdzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgY29uc3QgcHJvamVjdGVkVmlldyA9IHByb2plY3RlZFZpZXdzW2tdO1xuICAgICAgICAgIGNhbGNRdWVyeVZhbHVlcyhwcm9qZWN0ZWRWaWV3LCAwLCBwcm9qZWN0ZWRWaWV3LmRlZi5ub2Rlcy5sZW5ndGggLSAxLCBxdWVyeURlZiwgdmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKG5vZGVEZWYuY2hpbGRNYXRjaGVkUXVlcmllcyAmIHF1ZXJ5RGVmLmZpbHRlcklkKSAhPT0gcXVlcnlEZWYuZmlsdGVySWQpIHtcbiAgICAgIC8vIGlmIG5vIGNoaWxkIG1hdGNoZXMgdGhlIHF1ZXJ5LCBza2lwIHRoZSBjaGlsZHJlbi5cbiAgICAgIGkgKz0gbm9kZURlZi5jaGlsZENvdW50O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UXVlcnlWYWx1ZShcbiAgICB2aWV3OiBWaWV3RGF0YSwgbm9kZURlZjogTm9kZURlZiwgcXVlcnlWYWx1ZVR5cGU6IFF1ZXJ5VmFsdWVUeXBlKTogYW55IHtcbiAgaWYgKHF1ZXJ5VmFsdWVUeXBlICE9IG51bGwpIHtcbiAgICAvLyBhIG1hdGNoXG4gICAgc3dpdGNoIChxdWVyeVZhbHVlVHlwZSkge1xuICAgICAgY2FzZSBRdWVyeVZhbHVlVHlwZS5SZW5kZXJFbGVtZW50OlxuICAgICAgICByZXR1cm4gYXNFbGVtZW50RGF0YSh2aWV3LCBub2RlRGVmLm5vZGVJbmRleCkucmVuZGVyRWxlbWVudDtcbiAgICAgIGNhc2UgUXVlcnlWYWx1ZVR5cGUuRWxlbWVudFJlZjpcbiAgICAgICAgcmV0dXJuIG5ldyBFbGVtZW50UmVmKGFzRWxlbWVudERhdGEodmlldywgbm9kZURlZi5ub2RlSW5kZXgpLnJlbmRlckVsZW1lbnQpO1xuICAgICAgY2FzZSBRdWVyeVZhbHVlVHlwZS5UZW1wbGF0ZVJlZjpcbiAgICAgICAgcmV0dXJuIGFzRWxlbWVudERhdGEodmlldywgbm9kZURlZi5ub2RlSW5kZXgpLnRlbXBsYXRlO1xuICAgICAgY2FzZSBRdWVyeVZhbHVlVHlwZS5WaWV3Q29udGFpbmVyUmVmOlxuICAgICAgICByZXR1cm4gYXNFbGVtZW50RGF0YSh2aWV3LCBub2RlRGVmLm5vZGVJbmRleCkudmlld0NvbnRhaW5lcjtcbiAgICAgIGNhc2UgUXVlcnlWYWx1ZVR5cGUuUHJvdmlkZXI6XG4gICAgICAgIHJldHVybiBhc1Byb3ZpZGVyRGF0YSh2aWV3LCBub2RlRGVmLm5vZGVJbmRleCkuaW5zdGFuY2U7XG4gICAgfVxuICB9XG59XG4iXX0=