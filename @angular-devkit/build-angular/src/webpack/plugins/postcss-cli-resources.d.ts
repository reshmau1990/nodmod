import * as postcss from 'postcss';
import * as webpack from 'webpack';
export interface PostcssCliResourcesOptions {
    baseHref?: string;
    deployUrl?: string;
    resourcesOutputPath?: string;
    rebaseRootRelative?: boolean;
    /** CSS is extracted to a `.css` or is embedded in a `.js` file. */
    extracted?: boolean;
    filename: string;
    loader: webpack.loader.LoaderContext;
    emitFile: boolean;
}
declare const _default: postcss.Plugin<PostcssCliResourcesOptions>;
export default _default;
