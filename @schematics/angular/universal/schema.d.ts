/**
 * Pass this schematic to the "run" command to set up server-side rendering for an app.
 */
export interface Schema {
    /**
     * The name of the application folder.
     */
    appDir?: string;
    /**
     * The app identifier to use for transition.
     */
    appId?: string;
    /**
     * The name of the related client app. Required in place of "project".
     */
    clientProject: string;
    /**
     * The name of the main entry-point file.
     */
    main?: string;
    /**
     * The name of the root NgModule class.
     */
    rootModuleClassName?: string;
    /**
     * The name of the root NgModule file.
     */
    rootModuleFileName?: string;
    /**
     * Do not install packages for dependencies.
     */
    skipInstall?: boolean;
}
