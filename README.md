# vsc-ember-generator README

Ember component generator contextual menu

## Features

This extension adds options for generating Ember components and helpers to the contextual menu in the VS Code file explorer.

Commands invoked from the contextual menu will run the corresponding Ember CLI command:

* `component`: `ember g component (path + component name) {componentCommandOptions}`
* `component (with-class)`: `ember g component (path + component name) {classComponentCommandOptions}`
* `helper`: `ember g helper (path + helper name) {helperCommandOptions}`
* `helper (class-based)`: `ember g helper (path + helper name) {classHelperCommandOptions}`

![Generating a component from the file explorer](images/feature-generate-component.gif)

## Requirements

  * VS Code > 1.74.0

## Extension Settings

This extension contributes the following settings:

* `emberGenerator.componentCommandOptions`: command options used when selecting the`Ember generate... > component` option
* `emberGenerator.classComponentCommandOptions`: command options used when selecting the `Ember generate... > component (with class)` option
* `emberGenerator.helperCommandOptions`: command options used when selecting the `Ember generate... > helper` option
* `emberGenerator.classHelperCommandOptions`: command options used when selecting the `Ember generate... > helper (class-based)` option
