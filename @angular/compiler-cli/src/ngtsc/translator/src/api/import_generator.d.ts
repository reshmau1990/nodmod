/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/translator/src/api/import_generator" />
/**
 * Information about an import that has been added to a module.
 */
export interface Import {
    /** The name of the module that has been imported. */
    specifier: string;
    /** The alias of the imported module. */
    qualifier: string;
}
/**
 * The symbol name and import namespace of an imported symbol,
 * which has been registered through the ImportGenerator.
 */
export interface NamedImport<TExpression> {
    /** The import namespace containing this imported symbol. */
    moduleImport: TExpression | null;
    /** The (possibly rewritten) name of the imported symbol. */
    symbol: string;
}
/**
 * Generate import information based on the context of the code being generated.
 *
 * Implementations of these methods return a specific identifier that corresponds to the imported
 * module.
 */
export interface ImportGenerator<TExpression> {
    generateNamespaceImport(moduleName: string): TExpression;
    generateNamedImport(moduleName: string, originalSymbol: string): NamedImport<TExpression>;
}
