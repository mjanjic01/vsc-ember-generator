// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { generateComponent } from './commands/component';
import { generateHelper } from './commands/helper';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vsc-ember-generator.generateComponent', (fileUri: vscode.Uri) => generateComponent(fileUri)),
    vscode.commands.registerCommand('vsc-ember-generator.generateComponentWithClass', (fileUri: vscode.Uri) => generateComponent(fileUri, {withClass: true})),

    vscode.commands.registerCommand('vsc-ember-generator.generateHelper', (fileUri: vscode.Uri) => generateHelper(fileUri)),
    vscode.commands.registerCommand('vsc-ember-generator.generateHelperClassBased', (fileUri: vscode.Uri) => generateHelper(fileUri, {classBased: true})),
  );
}

// This method is called when your extension is deactivated
export function deactivate() { }
