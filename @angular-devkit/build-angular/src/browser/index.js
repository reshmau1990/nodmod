"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWebpackBrowser = exports.getCompilerConfig = exports.getAnalyticsConfig = void 0;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const architect_1 = require("@angular-devkit/architect");
const build_webpack_1 = require("@angular-devkit/build-webpack");
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const fs = require("fs");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const typescript_1 = require("typescript");
const utils_1 = require("../utils");
const action_executor_1 = require("../utils/action-executor");
const bundle_calculator_1 = require("../utils/bundle-calculator");
const cache_path_1 = require("../utils/cache-path");
const color_1 = require("../utils/color");
const copy_assets_1 = require("../utils/copy-assets");
const environment_options_1 = require("../utils/environment-options");
const i18n_inlining_1 = require("../utils/i18n-inlining");
const transforms_1 = require("../utils/index-file/transforms");
const write_index_html_1 = require("../utils/index-file/write-index-html");
const output_paths_1 = require("../utils/output-paths");
const read_tsconfig_1 = require("../utils/read-tsconfig");
const service_worker_1 = require("../utils/service-worker");
const spinner_1 = require("../utils/spinner");
const version_1 = require("../utils/version");
const webpack_browser_config_1 = require("../utils/webpack-browser-config");
const webpack_version_1 = require("../utils/webpack-version");
const configs_1 = require("../webpack/configs");
const analytics_1 = require("../webpack/plugins/analytics");
const async_chunks_1 = require("../webpack/utils/async-chunks");
const stats_1 = require("../webpack/utils/stats");
const cacheDownlevelPath = environment_options_1.cachingDisabled ? undefined : cache_path_1.findCachePath('angular-build-dl');
function getAnalyticsConfig(wco, context) {
    if (context.analytics) {
        // If there's analytics, add our plugin. Otherwise no need to slow down the build.
        let category = 'build';
        if (context.builder) {
            // We already vetted that this is a "safe" package, otherwise the analytics would be noop.
            category =
                context.builder.builderName.split(':')[1] || context.builder.builderName || 'build';
        }
        // The category is the builder name if it's an angular builder.
        return {
            plugins: [new analytics_1.NgBuildAnalyticsPlugin(wco.projectRoot, context.analytics, category, !!wco.tsConfig.options.enableIvy)],
        };
    }
    return {};
}
exports.getAnalyticsConfig = getAnalyticsConfig;
function getCompilerConfig(wco) {
    if (wco.buildOptions.main || wco.buildOptions.polyfills) {
        return wco.buildOptions.aot ? configs_1.getAotConfig(wco) : configs_1.getNonAotConfig(wco);
    }
    return {};
}
exports.getCompilerConfig = getCompilerConfig;
async function initialize(options, context, host, differentialLoadingMode, webpackConfigurationTransform) {
    var _a, _b;
    const originalOutputPath = options.outputPath;
    // Assets are processed directly by the builder except when watching
    const adjustedOptions = options.watch ? options : { ...options, assets: [] };
    // TODO_WEBPACK_5: Investigate build/serve issues with the `license-webpack-plugin` package
    if (adjustedOptions.extractLicenses && webpack_version_1.isWebpackFiveOrHigher()) {
        adjustedOptions.extractLicenses = false;
        context.logger.warn('Warning: License extraction is currently disabled when using Webpack 5. ' +
            'This is temporary and will be corrected in a future update.');
    }
    const { config, projectRoot, projectSourceRoot, i18n, } = await webpack_browser_config_1.generateI18nBrowserWebpackConfigFromContext(adjustedOptions, context, wco => [
        configs_1.getCommonConfig(wco),
        configs_1.getBrowserConfig(wco),
        configs_1.getStylesConfig(wco),
        configs_1.getStatsConfig(wco),
        getAnalyticsConfig(wco, context),
        getCompilerConfig(wco),
        wco.buildOptions.webWorkerTsConfig ? configs_1.getWorkerConfig(wco) : {},
    ], host, { differentialLoadingMode });
    // Validate asset option values if processed directly
    if (((_a = options.assets) === null || _a === void 0 ? void 0 : _a.length) && !((_b = adjustedOptions.assets) === null || _b === void 0 ? void 0 : _b.length)) {
        utils_1.normalizeAssetPatterns(options.assets, new core_1.virtualFs.SyncDelegateHost(host), core_1.normalize(context.workspaceRoot), core_1.normalize(projectRoot), projectSourceRoot === undefined ? undefined : core_1.normalize(projectSourceRoot)).forEach(({ output }) => {
            if (output.startsWith('..')) {
                throw new Error('An asset cannot be written to a location outside of the output path.');
            }
        });
    }
    let transformedConfig;
    if (webpackConfigurationTransform) {
        transformedConfig = await webpackConfigurationTransform(config);
    }
    if (options.deleteOutputPath) {
        utils_1.deleteOutputDir(context.workspaceRoot, originalOutputPath);
    }
    return { config: transformedConfig || config, projectRoot, projectSourceRoot, i18n };
}
// tslint:disable-next-line: no-big-function
function buildWebpackBrowser(options, context, transforms = {}) {
    var _a;
    const host = new node_1.NodeJsSyncHost();
    const root = core_1.normalize(context.workspaceRoot);
    const projectName = (_a = context.target) === null || _a === void 0 ? void 0 : _a.project;
    if (!projectName) {
        throw new Error('The builder requires a target.');
    }
    const baseOutputPath = path.resolve(context.workspaceRoot, options.outputPath);
    let outputPaths;
    // Check Angular version.
    version_1.assertCompatibleAngularVersion(context.workspaceRoot, context.logger);
    return rxjs_1.from(context.getProjectMetadata(projectName))
        .pipe(operators_1.switchMap(async (projectMetadata) => {
        var _a;
        const sysProjectRoot = core_1.getSystemPath(core_1.resolve(core_1.normalize(context.workspaceRoot), core_1.normalize((_a = projectMetadata.root) !== null && _a !== void 0 ? _a : '')));
        const { options: compilerOptions } = read_tsconfig_1.readTsconfig(options.tsConfig, context.workspaceRoot);
        const target = compilerOptions.target || typescript_1.ScriptTarget.ES5;
        const buildBrowserFeatures = new utils_1.BuildBrowserFeatures(sysProjectRoot);
        const isDifferentialLoadingNeeded = buildBrowserFeatures.isDifferentialLoadingNeeded(target);
        const differentialLoadingMode = !options.watch && isDifferentialLoadingNeeded;
        if (target > typescript_1.ScriptTarget.ES2015 && isDifferentialLoadingNeeded) {
            context.logger.warn(core_1.tags.stripIndent `
          Warning: Using differential loading with targets ES5 and ES2016 or higher may
          cause problems. Browsers with support for ES2015 will load the ES2016+ scripts
          referenced with script[type="module"] but they may not support ES2016+ syntax.
        `);
        }
        const hasIE9 = buildBrowserFeatures.supportedBrowsers.includes('ie 9');
        const hasIE10 = buildBrowserFeatures.supportedBrowsers.includes('ie 10');
        if (hasIE9 || hasIE10) {
            const browsers = (hasIE9 ? 'IE 9' + (hasIE10 ? ' & ' : '') : '') + (hasIE10 ? 'IE 10' : '');
            context.logger.warn(`Warning: Support was requested for ${browsers} in the project's browserslist configuration. ` +
                (hasIE9 && hasIE10 ? 'These browsers are' : 'This browser is') +
                ' no longer officially supported with Angular v11 and higher.' +
                '\nFor additional information: https://v10.angular.io/guide/deprecations#ie-9-10-and-mobile');
        }
        return {
            ...(await initialize(options, context, host, differentialLoadingMode, transforms.webpackConfiguration)),
            buildBrowserFeatures,
            isDifferentialLoadingNeeded,
            target,
        };
    }), 
    // tslint:disable-next-line: no-big-function
    operators_1.switchMap(({ config, projectRoot, projectSourceRoot, i18n, buildBrowserFeatures, isDifferentialLoadingNeeded, target }) => {
        const normalizedOptimization = utils_1.normalizeOptimization(options.optimization);
        const indexTransforms = transforms_1.getHtmlTransforms(normalizedOptimization, buildBrowserFeatures, transforms.indexHtml);
        return build_webpack_1.runWebpack(config, context, {
            webpackFactory: require('webpack'),
            logging: transforms.logging || ((stats, config) => {
                if (options.verbose) {
                    context.logger.info(stats.toString(config.stats));
                }
            }),
        }).pipe(
        // tslint:disable-next-line: no-big-function
        operators_1.concatMap(async (buildEvent) => {
            var _a, _b, _c, _d;
            const spinner = new spinner_1.Spinner();
            spinner.enabled = options.progress !== false;
            const { webpackStats: webpackRawStats, success, emittedFiles = [] } = buildEvent;
            if (!webpackRawStats) {
                throw new Error('Webpack stats build result is required.');
            }
            // Fix incorrectly set `initial` value on chunks.
            const extraEntryPoints = configs_1.normalizeExtraEntryPoints(options.styles || [], 'styles')
                .concat(configs_1.normalizeExtraEntryPoints(options.scripts || [], 'scripts'));
            const webpackStats = {
                ...webpackRawStats,
                chunks: async_chunks_1.markAsyncChunksNonInitial(webpackRawStats, extraEntryPoints),
            };
            if (!success) {
                // If using bundle downleveling then there is only one build
                // If it fails show any diagnostic messages and bail
                if (stats_1.statsHasWarnings(webpackStats)) {
                    context.logger.warn(stats_1.statsWarningsToString(webpackStats, { colors: true }));
                }
                if (stats_1.statsHasErrors(webpackStats)) {
                    context.logger.error(stats_1.statsErrorsToString(webpackStats, { colors: true }));
                }
                return { success };
            }
            else {
                const bundleInfoStats = [];
                outputPaths = output_paths_1.ensureOutputPaths(baseOutputPath, i18n);
                let noModuleFiles;
                let moduleFiles;
                let files;
                const scriptsEntryPointName = configs_1.normalizeExtraEntryPoints(options.scripts || [], 'scripts').map(x => x.bundleName);
                if (isDifferentialLoadingNeeded && options.watch) {
                    moduleFiles = emittedFiles;
                    files = moduleFiles.filter(x => x.extension === '.css' || (x.name && scriptsEntryPointName.includes(x.name)));
                    if (i18n.shouldInline) {
                        const success = await i18n_inlining_1.i18nInlineEmittedFiles(context, emittedFiles, i18n, baseOutputPath, Array.from(outputPaths.values()), scriptsEntryPointName, 
                        // tslint:disable-next-line: no-non-null-assertion
                        webpackStats.outputPath, target <= typescript_1.ScriptTarget.ES5, options.i18nMissingTranslation);
                        if (!success) {
                            return { success: false };
                        }
                    }
                }
                else if (isDifferentialLoadingNeeded) {
                    moduleFiles = [];
                    noModuleFiles = [];
                    // Common options for all bundle process actions
                    const sourceMapOptions = utils_1.normalizeSourceMaps(options.sourceMap || false);
                    const actionOptions = {
                        optimize: normalizedOptimization.scripts,
                        sourceMaps: sourceMapOptions.scripts,
                        hiddenSourceMaps: sourceMapOptions.hidden,
                        vendorSourceMaps: sourceMapOptions.vendor,
                        integrityAlgorithm: options.subresourceIntegrity ? 'sha384' : undefined,
                    };
                    let mainChunkId;
                    const actions = [];
                    let workerReplacements;
                    const seen = new Set();
                    for (const file of emittedFiles) {
                        // Assets are not processed nor injected into the index
                        if (file.asset) {
                            // WorkerPlugin adds worker files to assets
                            if (file.file.endsWith('.worker.js')) {
                                if (!workerReplacements) {
                                    workerReplacements = [];
                                }
                                workerReplacements.push([
                                    file.file,
                                    file.file.replace(/\-(es20\d{2}|esnext)/, '-es5'),
                                ]);
                            }
                            else {
                                continue;
                            }
                        }
                        // Scripts and non-javascript files are not processed
                        if (file.extension !== '.js' ||
                            (file.name && scriptsEntryPointName.includes(file.name))) {
                            if (files === undefined) {
                                files = [];
                            }
                            files.push(file);
                            continue;
                        }
                        // Ignore already processed files; emittedFiles can contain duplicates
                        if (seen.has(file.file)) {
                            continue;
                        }
                        seen.add(file.file);
                        if (file.name === 'vendor' || (!mainChunkId && file.name === 'main')) {
                            // tslint:disable-next-line: no-non-null-assertion
                            mainChunkId = file.id.toString();
                        }
                        // All files at this point except ES5 polyfills are module scripts
                        const es5Polyfills = file.file.startsWith('polyfills-es5');
                        if (!es5Polyfills) {
                            moduleFiles.push(file);
                        }
                        // Retrieve the content/map for the file
                        // NOTE: Additional future optimizations will read directly from memory
                        // tslint:disable-next-line: no-non-null-assertion
                        let filename = path.join(webpackStats.outputPath, file.file);
                        const code = fs.readFileSync(filename, 'utf8');
                        let map;
                        if (actionOptions.sourceMaps) {
                            try {
                                map = fs.readFileSync(filename + '.map', 'utf8');
                                if (es5Polyfills) {
                                    fs.unlinkSync(filename + '.map');
                                }
                            }
                            catch (_e) { }
                        }
                        if (es5Polyfills) {
                            fs.unlinkSync(filename);
                            filename = filename.replace(/\-es20\d{2}/, '');
                        }
                        const es2015Polyfills = file.file.startsWith('polyfills-es20');
                        // Record the bundle processing action
                        // The runtime chunk gets special processing for lazy loaded files
                        actions.push({
                            ...actionOptions,
                            filename,
                            code,
                            map,
                            // id is always present for non-assets
                            // tslint:disable-next-line: no-non-null-assertion
                            name: file.id,
                            runtime: file.file.startsWith('runtime'),
                            ignoreOriginal: es5Polyfills,
                            optimizeOnly: es2015Polyfills,
                        });
                        // ES2015 polyfills are only optimized; optimization check was performed above
                        if (es2015Polyfills) {
                            continue;
                        }
                        // Add the newly created ES5 bundles to the index as nomodule scripts
                        const newFilename = es5Polyfills
                            ? file.file.replace(/\-es20\d{2}/, '')
                            : file.file.replace(/\-(es20\d{2}|esnext)/, '-es5');
                        noModuleFiles.push({ ...file, file: newFilename });
                    }
                    const processActions = [];
                    let processRuntimeAction;
                    const processResults = [];
                    for (const action of actions) {
                        // If SRI is enabled always process the runtime bundle
                        // Lazy route integrity values are stored in the runtime bundle
                        if (action.integrityAlgorithm && action.runtime) {
                            processRuntimeAction = action;
                        }
                        else {
                            processActions.push({ replacements: workerReplacements, ...action });
                        }
                    }
                    const executor = new action_executor_1.BundleActionExecutor({ cachePath: cacheDownlevelPath, i18n }, options.subresourceIntegrity ? 'sha384' : undefined);
                    // Execute the bundle processing actions
                    try {
                        spinner.start('Generating ES5 bundles for differential loading...');
                        for await (const result of executor.processAll(processActions)) {
                            processResults.push(result);
                        }
                        // Runtime must be processed after all other files
                        if (processRuntimeAction) {
                            const runtimeOptions = {
                                ...processRuntimeAction,
                                runtimeData: processResults,
                                supportedBrowsers: buildBrowserFeatures.supportedBrowsers,
                            };
                            processResults.push(await Promise.resolve().then(() => require('../utils/process-bundle')).then(m => m.process(runtimeOptions)));
                        }
                        spinner.succeed('ES5 bundle generation complete.');
                        if (i18n.shouldInline) {
                            spinner.start('Generating localized bundles...');
                            const inlineActions = [];
                            const processedFiles = new Set();
                            for (const result of processResults) {
                                if (result.original) {
                                    inlineActions.push({
                                        filename: path.basename(result.original.filename),
                                        code: fs.readFileSync(result.original.filename, 'utf8'),
                                        map: result.original.map &&
                                            fs.readFileSync(result.original.map.filename, 'utf8'),
                                        outputPath: baseOutputPath,
                                        es5: false,
                                        missingTranslation: options.i18nMissingTranslation,
                                        setLocale: result.name === mainChunkId,
                                    });
                                    processedFiles.add(result.original.filename);
                                    if (result.original.map) {
                                        processedFiles.add(result.original.map.filename);
                                    }
                                }
                                if (result.downlevel) {
                                    inlineActions.push({
                                        filename: path.basename(result.downlevel.filename),
                                        code: fs.readFileSync(result.downlevel.filename, 'utf8'),
                                        map: result.downlevel.map &&
                                            fs.readFileSync(result.downlevel.map.filename, 'utf8'),
                                        outputPath: baseOutputPath,
                                        es5: true,
                                        missingTranslation: options.i18nMissingTranslation,
                                        setLocale: result.name === mainChunkId,
                                    });
                                    processedFiles.add(result.downlevel.filename);
                                    if (result.downlevel.map) {
                                        processedFiles.add(result.downlevel.map.filename);
                                    }
                                }
                            }
                            let hasErrors = false;
                            try {
                                for await (const result of executor.inlineAll(inlineActions)) {
                                    if (options.verbose) {
                                        context.logger.info(`Localized "${result.file}" [${result.count} translation(s)].`);
                                    }
                                    for (const diagnostic of result.diagnostics) {
                                        spinner.stop();
                                        if (diagnostic.type === 'error') {
                                            hasErrors = true;
                                            context.logger.error(diagnostic.message);
                                        }
                                        else {
                                            context.logger.warn(diagnostic.message);
                                        }
                                        spinner.start();
                                    }
                                }
                                // Copy any non-processed files into the output locations
                                await copy_assets_1.copyAssets([
                                    {
                                        glob: '**/*',
                                        // tslint:disable-next-line: no-non-null-assertion
                                        input: webpackStats.outputPath,
                                        output: '',
                                        ignore: [...processedFiles].map(f => 
                                        // tslint:disable-next-line: no-non-null-assertion
                                        path.relative(webpackStats.outputPath, f)),
                                    },
                                ], Array.from(outputPaths.values()), '');
                            }
                            catch (err) {
                                spinner.fail('Localized bundle generation failed.');
                                return { success: false, error: mapErrorToMessage(err) };
                            }
                            if (hasErrors) {
                                spinner.fail('Localized bundle generation failed.');
                            }
                            else {
                                spinner.succeed('Localized bundle generation complete.');
                            }
                            if (hasErrors) {
                                return { success: false };
                            }
                        }
                    }
                    finally {
                        executor.stop();
                    }
                    for (const result of processResults) {
                        const chunk = (_a = webpackStats.chunks) === null || _a === void 0 ? void 0 : _a.find((chunk) => chunk.id.toString() === result.name);
                        if (result.original) {
                            bundleInfoStats.push(generateBundleInfoStats(result.original, chunk, 'modern'));
                        }
                        if (result.downlevel) {
                            bundleInfoStats.push(generateBundleInfoStats(result.downlevel, chunk, 'legacy'));
                        }
                    }
                    const unprocessedChunks = ((_b = webpackStats.chunks) === null || _b === void 0 ? void 0 : _b.filter((chunk) => !processResults
                        .find((result) => chunk.id.toString() === result.name))) || [];
                    for (const chunk of unprocessedChunks) {
                        const asset = (_c = webpackStats.assets) === null || _c === void 0 ? void 0 : _c.find(a => a.name === chunk.files[0]);
                        bundleInfoStats.push(stats_1.generateBundleStats({ ...chunk, size: asset === null || asset === void 0 ? void 0 : asset.size }));
                    }
                    // Check for budget errors and display them to the user.
                    const budgets = options.budgets || [];
                    const budgetFailures = bundle_calculator_1.checkBudgets(budgets, webpackStats, processResults);
                    for (const { severity, message } of budgetFailures) {
                        switch (severity) {
                            case bundle_calculator_1.ThresholdSeverity.Warning:
                                webpackStats.warnings.push(message);
                                break;
                            case bundle_calculator_1.ThresholdSeverity.Error:
                                webpackStats.errors.push(message);
                                break;
                            default:
                                assertNever(severity);
                        }
                    }
                }
                else {
                    files = emittedFiles.filter(x => x.name !== 'polyfills-es5');
                    noModuleFiles = emittedFiles.filter(x => x.name === 'polyfills-es5');
                    if (i18n.shouldInline) {
                        const success = await i18n_inlining_1.i18nInlineEmittedFiles(context, emittedFiles, i18n, baseOutputPath, Array.from(outputPaths.values()), scriptsEntryPointName, 
                        // tslint:disable-next-line: no-non-null-assertion
                        webpackStats.outputPath, target <= typescript_1.ScriptTarget.ES5, options.i18nMissingTranslation);
                        if (!success) {
                            return { success: false };
                        }
                    }
                }
                // Copy assets
                if (!options.watch && ((_d = options.assets) === null || _d === void 0 ? void 0 : _d.length)) {
                    spinner.start('Copying assets...');
                    try {
                        await copy_assets_1.copyAssets(utils_1.normalizeAssetPatterns(options.assets, new core_1.virtualFs.SyncDelegateHost(host), root, core_1.normalize(projectRoot), projectSourceRoot === undefined ? undefined : core_1.normalize(projectSourceRoot)), Array.from(outputPaths.values()), context.workspaceRoot);
                        spinner.succeed('Copying assets complete.');
                    }
                    catch (err) {
                        spinner.fail(color_1.colors.redBright('Copying of assets failed.'));
                        return { success: false, error: 'Unable to copy assets: ' + err.message };
                    }
                }
                if (success) {
                    if (options.index) {
                        spinner.start('Generating index html...');
                        for (const [locale, outputPath] of outputPaths.entries()) {
                            try {
                                await write_index_html_1.writeIndexHtml({
                                    host,
                                    outputPath: path.join(outputPath, webpack_browser_config_1.getIndexOutputFile(options.index)),
                                    indexPath: path.join(context.workspaceRoot, webpack_browser_config_1.getIndexInputFile(options.index)),
                                    files,
                                    noModuleFiles,
                                    moduleFiles,
                                    baseHref: getLocaleBaseHref(i18n, locale) || options.baseHref,
                                    deployUrl: options.deployUrl,
                                    sri: options.subresourceIntegrity,
                                    scripts: options.scripts,
                                    styles: options.styles,
                                    postTransforms: indexTransforms,
                                    crossOrigin: options.crossOrigin,
                                    // i18nLocale is used when Ivy is disabled
                                    lang: locale || options.i18nLocale,
                                });
                            }
                            catch (error) {
                                spinner.fail('Index html generation failed.');
                                return { success: false, error: mapErrorToMessage(error) };
                            }
                            spinner.succeed('Index html generation complete.');
                        }
                    }
                    if (options.serviceWorker) {
                        spinner.start('Generating service worker...');
                        for (const [locale, outputPath] of outputPaths.entries()) {
                            try {
                                await service_worker_1.augmentAppWithServiceWorker(host, root, core_1.normalize(projectRoot), core_1.normalize(outputPath), getLocaleBaseHref(i18n, locale) || options.baseHref || '/', options.ngswConfigPath);
                            }
                            catch (error) {
                                spinner.fail('Service worker generation failed.');
                                return { success: false, error: mapErrorToMessage(error) };
                            }
                            spinner.succeed('Service worker generation complete.');
                        }
                    }
                }
                stats_1.webpackStatsLogger(context.logger, webpackStats, config, bundleInfoStats);
                return { success: !stats_1.statsHasErrors(webpackStats) };
            }
        }), operators_1.map(event => ({
            ...event,
            baseOutputPath,
            outputPath: baseOutputPath,
            outputPaths: outputPaths && Array.from(outputPaths.values()) || [baseOutputPath],
        })));
    }));
    function getLocaleBaseHref(i18n, locale) {
        var _a, _b;
        if (i18n.locales[locale] && ((_a = i18n.locales[locale]) === null || _a === void 0 ? void 0 : _a.baseHref) !== '') {
            return utils_1.urlJoin(options.baseHref || '', (_b = i18n.locales[locale].baseHref) !== null && _b !== void 0 ? _b : `/${locale}/`);
        }
        return undefined;
    }
}
exports.buildWebpackBrowser = buildWebpackBrowser;
function mapErrorToMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return undefined;
}
function assertNever(input) {
    throw new Error(`Unexpected call to assertNever() with input: ${JSON.stringify(input, null /* replacer */, 4 /* tabSize */)}`);
}
function generateBundleInfoStats(bundle, chunk, chunkType) {
    return stats_1.generateBundleStats({
        size: bundle.size,
        files: bundle.map ? [bundle.filename, bundle.map.filename] : [bundle.filename],
        names: chunk === null || chunk === void 0 ? void 0 : chunk.names,
        entry: !!(chunk === null || chunk === void 0 ? void 0 : chunk.names.includes('runtime')),
        initial: !!(chunk === null || chunk === void 0 ? void 0 : chunk.initial),
        rendered: true,
        chunkType,
    });
}
exports.default = architect_1.createBuilder(buildWebpackBrowser);
