import * as vscode from 'vscode';

import { invokeEmberCliCommand } from '../utils/ember-cli-adapter';
import { resolveEntityData } from '../utils/entity-path';

const config = vscode.workspace.getConfiguration('emberGenerator');
const templateOnlyComponentSwitch = config.get('templateOnlyComponentSwitch') as string;

export async function generateComponent(fileUri: vscode.Uri, opts?: {templateOnly: boolean}) {
  const filePath = fileUri.path as string;
  const workspaceFolder = vscode.workspace.workspaceFolders?.find((workspaceFolder) => filePath.startsWith(workspaceFolder.uri.path));
  if (!workspaceFolder) {
    vscode.window.showErrorMessage(`Invalid project`);
    return;
  }

  const workspacePath = workspaceFolder?.uri.path;
  let componentData;

  try {
    componentData = resolveEntityData(filePath, workspacePath, 'components');
  } catch (e: any) {
    vscode.window.showInformationMessage(e.message);
    return;
  }

  let input = await vscode.window.showInputBox({
    placeHolder: 'componentName',
    value: 'component',
    prompt: 'Your component name'
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
  } = componentData;
  const fullComponentPath = [relativePath, input].filter(Boolean).join('/');

  void invokeEmberCliCommand(
    workspacePath,
    [
      'generate',
      'component',
      fullComponentPath,
      '--pod'
    ]
    .concat(opts?.templateOnly ? templateOnlyComponentSwitch : [])
    .concat(isBundleEntity ? `--bundle=${bundleName}` : [])
  );
}
