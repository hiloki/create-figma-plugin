---
order: 2
title: Quick start
---

# Quick start

## Pre-requisites

- [Node.js](https://nodejs.org) – v14
- [Figma desktop app](https://figma.com/downloads/)

## Bootstrapping a new plugin/widget from a template

```
$ npx --yes create-figma-plugin
```

You’ll then be prompted to select from the following templates:

- [`plugin/hello-world`](https://github.com/yuanqing/create-figma-plugin/tree/main/packages/create-figma-plugin/templates/plugin/hello-world) — A plugin without a UI.
- [`plugin/preact-rectangles`](https://github.com/yuanqing/create-figma-plugin/tree/main/packages/create-figma-plugin/templates/plugin/preact-rectangles) — A plugin with a UI built using [Create Figma Plugin’s Preact component library](#using-the-preact-component-library).
- [`plugin/preact-resizable`](https://github.com/yuanqing/create-figma-plugin/tree/main/packages/create-figma-plugin/templates/plugin/preact-resizable) — A plugin with a [resizable UI window](#making-the-pluginwidget-ui-window-resizable).
- [`plugin/react-editor`](https://github.com/yuanqing/create-figma-plugin/tree/main/packages/create-figma-plugin/templates/plugin/react-editor) — A plugin with a UI that [uses a React component](#using-react).
- [`widget/notepad`](https://github.com/yuanqing/create-figma-plugin/tree/main/packages/create-figma-plugin/templates/widget/notepad) — A FigJam widget with a UI.

## Configuring the plugin/widget

- [Figma/FigJam plugin API docs](https://figma.com/plugin-docs/)
- [FigJam widget API docs](https://figma.com/widget-docs/)

Configuration options for your plugin/widget go under the **`"figma-plugin"`** key of your `package.json` file.

A Figma plugin (eg. [`plugin/preact-rectangles`](https://github.com/yuanqing/create-figma-plugin/tree/main/packages/create-figma-plugin/templates/plugin/preact-rectangles)) would be configured as follows:

```json
{
  "figma-plugin": {
    "editorType": [
      "figma"
    ],
    // ...
    "name": "Rectangles",
    "main": "src/main.ts",
    "ui": "src/ui.tsx"
  }
}
```

See that:

- [**`"main"`**](#main) is set to `src/main.ts`, which is the main entry point for the plugin.
- [**`"ui"`**](#ui) is set to `src/ui.tsx`, which is the plugin’s [UI implementation](#ui-1).

A FigJam widget (eg. [`widget/notepad`](https://github.com/yuanqing/create-figma-plugin/tree/main/packages/create-figma-plugin/templates/widget/notepad)) would be configured as follows:

```json
{
  "figma-plugin": {
    "editorType": [
      "figjam"
    ],
    "containsWidget": true,
    // ...
    "name": "Notepad",
    "main": "src/main.tsx",
    "ui": "src/ui.tsx"
  }
}
```

Because this is a FigJam widget, see that:

- [**`"editorType"`**](#editortype) is set to `figjam`.
- [**`"containsWidget"`**](#containswidget) is set to `true`.

See all the supported [configuration options](#configuration-options).

## Building the plugin/widget

In the `package.json` file, we have `build` and `watch` scripts set up to invoke the `build-figma-plugin` CLI:

```json
{
  "scripts": {
    "build": "build-figma-plugin --typecheck --minify",
    "watch": "build-figma-plugin --typecheck --watch"
  }
}
```

The `build-figma-plugin` CLI is powered by [esbuild](https://esbuild.github.io), which enables extremely fast, sub-second builds. When the `--typecheck` flag is specified, your TypeScript code will also be compiled and type-checked by the [TypeScript compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

To build the plugin/widget:

```
$ npm run build
```

This will generate a `manifest.json` file and a `build/` directory containing the JavaScript bundle(s) for the plugin/widget.

- [Plugin Manifest](https://figma.com/plugin-docs/manifest/)
- [Widget Manifest](https://figma.com/widget-docs/widget-manifest/)

To watch for code changes and rebuild the plugin/widget automatically:

```
$ npm run watch
```

## Installing the plugin/widget

1. In the Figma desktop app, open a Figma/FigJam document.
2. Search for and run `Import plugin from manifest…` or `Import widget from manifest…` via the Quick Actions search bar.
3. Select the `manifest.json` file that was generated by the `build` script.

## Debugging

Use `console.log` statements to inspect values in your code.

To open the developer console, search for and run `Open Console` via the Quick Actions search bar.

## Publishing to Figma Community

- [Publishing a plugin](https://help.figma.com/hc/en-us/articles/360042293394-Publish-plugins-to-the-Figma-Community)
- [Publishing a widget](https://help.figma.com/hc/en-us/articles/4410337103639-Publish-widgets-to-the-Figma-Community)

Figma will generate a unique ID for you when you first try to publish your plugin/widget. Copy and paste that ID into the **`"figma-plugin"`** configuration (under the [**`"id"`**](#id) key), then run the `build` script again to regenerate the plugin/widget’s `manifest.json` file.

## See also

- [`yuanqing/awesome-create-figma-plugin`](https://github.com/yuanqing/awesome-create-figma-plugin#readme)
- [`yuanqing/figma-plugins`](https://github.com/yuanqing/figma-plugins#readme)

Official docs and code samples from Figma:

- [Figma/FigJam plugin API docs](https://figma.com/plugin-docs/)
- [FigJam widget API docs](https://figma.com/widget-docs/)
- [`figma/plugin-samples`](https://github.com/figma/plugin-samples#readme)
- [`figma/widget-samples`](https://github.com/figma/widget-samples#readme)