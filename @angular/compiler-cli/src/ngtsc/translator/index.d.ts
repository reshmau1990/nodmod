/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/translator" />
export { AstFactory, BinaryOperator, LeadingComment, ObjectLiteralProperty, SourceMapLocation, SourceMapRange, TemplateElement, TemplateLiteral, UnaryOperator, VariableDeclarationType } from './src/api/ast_factory';
export { Import, ImportGenerator, NamedImport } from './src/api/import_generator';
export { ImportManager } from './src/import_manager';
export { RecordWrappedNodeExprFn } from './src/translator';
export { translateType } from './src/type_translator';
export { attachComments, TypeScriptAstFactory } from './src/typescript_ast_factory';
export { translateExpression, translateStatement } from './src/typescript_translator';
