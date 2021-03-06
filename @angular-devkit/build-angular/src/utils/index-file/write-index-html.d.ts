/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EmittedFiles } from '@angular-devkit/build-webpack';
import { virtualFs } from '@angular-devkit/core';
import { ExtraEntryPoint } from '../../browser/schema';
import { CrossOriginValue } from './augment-index-html';
export interface WriteIndexHtmlOptions {
    host: virtualFs.Host;
    outputPath: string;
    indexPath: string;
    files?: EmittedFiles[];
    noModuleFiles?: EmittedFiles[];
    moduleFiles?: EmittedFiles[];
    baseHref?: string;
    deployUrl?: string;
    sri?: boolean;
    scripts?: ExtraEntryPoint[];
    styles?: ExtraEntryPoint[];
    postTransforms: IndexHtmlTransform[];
    crossOrigin?: CrossOriginValue;
    lang?: string;
}
export declare type IndexHtmlTransform = (content: string) => Promise<string>;
export declare function writeIndexHtml({ host, outputPath, indexPath, files, noModuleFiles, moduleFiles, baseHref, deployUrl, sri, scripts, styles, postTransforms, crossOrigin, lang, }: WriteIndexHtmlOptions): Promise<void>;
