# vsc-ember-generator README

Ember component generator contextual menu

Disclaimer: this is a codebase-specific extension, it will be modified and published in the future. But it's still useable now :)

## Features

This extension adds options for generating Ember components and helpers to the contextual menu in the VS Code file explorer.

Commands invoked from the contextual menu will run the corresponding Ember CLI command:

* `component`: `ember g component --pod {templateOnlyComponentSwitch} (path + component name)`
* `component (template-only)`: `ember g component --pod (path + component name)`
* `helper`: `ember g helper (path + helper name)`
* `helper (class-based)`: `ember g helper {classBasedHelperSwitch} (path + helper name)`

![Generating a component from the file explorer](images/feature-generate-component.gif)

## Requirements

  * VS Code > 1.74.0

## Extension Settings

This extension contributes the following settings:

* `emberGenerator.classBasedHelperSwitch`: CLI command switch used when selecting the `Ember generate... > component` option
* `emberGenerator.templateOnlyComponentSwitch`: CLI command switch used when selecting the `Ember generate... > helper (class-based)` option
