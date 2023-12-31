import * as vscode from 'vscode';

import { invokeEmberCliCommand } from '../utils/ember-cli-adapter';
import { resolveEntityData } from '../utils/entity-path';

const config = vscode.workspace.getConfiguration('emberGenerator');

const helperCommandOptions = config.get('helperCommandOptions') as string;
const classHelperCommandOptions = config.get('classHelperCommandOptions') as string;

export async function generateHelper(fileUri: vscode.Uri, opts?: {classBased: boolean}) {
  const filePath = fileUri.path as string;
  const workspaceFolder = vscode.workspace.workspaceFolders?.find((workspaceFolder) => filePath.startsWith(workspaceFolder.uri.path));
  if (!workspaceFolder) {
    vscode.window.showErrorMessage(`Invalid project`);
    return;
  }

  const workspacePath = workspaceFolder?.uri.path;
  let relativePath;

  try {
    relativePath = resolveEntityData(filePath, workspacePath, 'helpers');
  } catch (e: any) {
    vscode.window.showInformationMessage(e.message);
    return;
  }

  let input = await vscode.window.showInputBox({
    placeHolder: 'helperName',
    value: 'helper',
    prompt: 'Your helper name'
  });
  input = input?.trim();

  if (!input) {
    vscode.window.showInformationMessage(`No input was given`);
    return;
  }

  const fullHelperPath = [relativePath, input].filter(Boolean).join('/');

  void invokeEmberCliCommand(
    workspacePath,
    [
      'generate',
      'helper',
      fullHelperPath,
      ...(opts?.classBased ? classHelperCommandOptions : helperCommandOptions),
    ]
  );
}
