import * as vscode from 'vscode';

import { invokeEmberCliCommand } from '../utils/ember-cli-adapter';
import { resolveEntityData } from '../utils/entity-path';

const config = vscode.workspace.getConfiguration('emberGenerator');
const classBasedHelperSwitch = config.get('classBasedHelperSwitch') as string;

export async function generateHelper(fileUri: vscode.Uri, opts?: {classBased: boolean}) {
  const filePath = fileUri.path as string;
  const workspaceFolder = vscode.workspace.workspaceFolders?.find((workspaceFolder) => filePath.startsWith(workspaceFolder.uri.path));
  if (!workspaceFolder) {
    vscode.window.showErrorMessage(`Invalid project`);
    return;
  }

  const workspacePath = workspaceFolder?.uri.path;
  let helperData;

  try {
    helperData = resolveEntityData(filePath, workspacePath, 'helpers');
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

  const {
    relativePath,
    isBundleEntity,
    bundleName
  } = helperData;
  const fullHelperPath = [relativePath, input].filter(Boolean).join('/');

  void invokeEmberCliCommand(
    workspacePath,
    [
      'generate',
      'helper',
      fullHelperPath
    ]
    .concat(opts?.classBased ? classBasedHelperSwitch : [])
    .concat(isBundleEntity ? `--bundle=${bundleName}` : [])
  );
}
