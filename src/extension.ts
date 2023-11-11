'use strict'

import * as vscode from 'vscode'
import { DependencyProvider } from './DependencyProvider';

export function activate(context: vscode.ExtensionContext) {
  const fsPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
    ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
  
  const nodeDependenciesProvider = new DependencyProvider(fsPath);
  
  vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
  
  vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => {
    nodeDependenciesProvider.refresh()
  });
  
  vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`))
  });
}