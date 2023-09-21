import * as vscode from 'vscode';

import ReadableStream from './read-stream';
import WritableStream from './write-stream';

enum WriteLevel {
  debug = 'DEBUG',
  info = 'INFO',
  warning = 'WARNING',
  error = 'ERROR',
}

interface IOpts {
  inputStream: ReadableStream
  outputStream: WritableStream
  errorStream: WritableStream
  writeLevel?: WriteLevel
}

export default class UiBridge {
  writeData: string = '';

  writeLevel: WriteLevel;

  private progressResolve?: (value: unknown) => void;

  constructor(private opts: IOpts) {
    this.writeLevel = opts.writeLevel ?? WriteLevel.debug;
  }

  write(message: string, level: WriteLevel = WriteLevel.debug) {
    switch(level) {
      case 'ERROR':
        this.opts.errorStream.writeString(message);
        break;
      case 'WARNING':
        this.opts.errorStream.writeString(message);
        break;
      case 'DEBUG':
      case 'INFO':
      default:
        this.opts.outputStream.writeString(message);
        break;
    }
  }

  writeLine(message: string, level?: WriteLevel) {
    this.write(message.concat('\n'), level ?? this.writeLevel);
  }

  writeErrorLine(message: string) {
    this.writeLine(message, WriteLevel.error);
  }

  writeDebugLine(message: string) {
    this.writeLine(message, WriteLevel.debug);
  }

  writeInfoLine(message: string) {
    this.writeLine(message, WriteLevel.info);
  }

  writeWarnLine(message: string) {
    this.writeLine(message, WriteLevel.warning);
  }

  writeDeprecateLine(message: string) {
    this.writeLine(message, WriteLevel.warning);
  }

  writeError(error: Error) {
    this.writeLine(error.message, WriteLevel.error);
  }


  setWriteLevel(level: WriteLevel) {
    this.writeLevel = level;
  }

  writeLevelVisible(level: WriteLevel) {
    return true;
  }

  startProgress(message: string) {
    const progressPromise = new Promise((resolve) => {
      this.progressResolve = resolve;
    });

    vscode.window.withProgress({
      cancellable: false,
      title: message,
      location: vscode.ProgressLocation.Notification
    }, () => progressPromise);

    return progressPromise;
  }

  stopProgress() {
    this.progressResolve?.(null);
  }

  async prompt(queryForInquirer: {
    choices: Array<{key: string, name: string, value: string}>
    default: unknown,
    message: string,
    name: string,
    type: string
  }) {
    const choice = await vscode.window.showQuickPick(
      queryForInquirer.choices
        .filter((choice) => !['diff', 'edit'].includes(choice.value))
        .map((choice) => ({
          label: choice.name,
          picked: choice.value === 'skip',
          value: choice.value
        })
      ),
      {
        title: queryForInquirer.message,
        canPickMany: false
      }
    );

    if (!choice) {
      return Promise.reject('Cancelled');
    }

    return {
      answer: choice.value
    };
  }
}
