'use strict';

import { workspace, window, commands, Uri, ExtensionContext } from 'vscode';
import { DependencyProvider } from './DependencyProvider';

export function activate(context: ExtensionContext) {
  const path = (workspace.workspaceFolders && (workspace.workspaceFolders.length > 0))
    ? workspace.workspaceFolders[0].uri.fsPath
    : undefined;
  
  const nodeDependenciesProvider = new DependencyProvider(path);
  
  window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
  
  commands.registerCommand('nodeDependencies.refreshEntry', () => {
    nodeDependenciesProvider.refresh();
  });
  
  commands.registerCommand('extension.openPackageOnNpm', moduleName => {
    commands.executeCommand('vscode.open', Uri.parse(`https://www.npmjs.com/package/${moduleName}`));
  });
}