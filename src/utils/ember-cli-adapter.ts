import * as vscode from 'vscode';
import resolve from 'resolve';


import WritableStream from '../utils/write-stream';
import ReadableStream from '../utils/read-stream';
import UiBridge from '../utils/ui-bridge';

async function promiseResolve(id: string, basedir: string) {
  return new Promise((pResolve, pReject) => {
    resolve(id, {basedir}, (err, path) => {
      if (err) {
        return pReject(err);
      }

      return pResolve(path);
    });
  });
}

export async function invokeEmberCliCommand(workspacePath: string, cliArgs: string[]) {
  process.chdir(workspacePath);

  let cliPath;
  let cli;

  try {
    cliPath = await promiseResolve('ember-cli', workspacePath);
    if (typeof cliPath !== 'string' || !cliPath) {
      throw new Error('Ember CLI was not detected in this workspace');
    }

    cli = require(cliPath); // cli = (await import(cliPath)).default;
  } catch (e) {
    vscode.window.showErrorMessage(`${cliPath}, ${JSON.stringify(e)}`);
    return;
  }

  const inStream = new ReadableStream();
  const outStream = new WritableStream();
  const errStream = new WritableStream();

  return cli({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      UI: UiBridge,
      cliArgs,
      inputStream: inStream,
      outputStream: outStream,
      errorStream: errStream,
      cli: {
        name: 'ember',
        npmPackage: 'ember-cli',
        root: cliPath.replace(/.*\/index\.js$/, '')
      }
  }).then(function(status?: number) {
    if (!status || status === 1) {
      vscode.window.showInformationMessage(outStream.data);
    } else {
      vscode.window.showWarningMessage(`Unhandled success status ${status}`);
    }
  }, function(err: unknown) {
    vscode.window.showErrorMessage(errStream.data);
  }).finally(() => {
    inStream.destroy();
    outStream.destroy();
    errStream.destroy();
  });
}
