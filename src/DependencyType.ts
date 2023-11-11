import * as path from 'path';
import * as vscode from 'vscode';

export class DependencyType extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
  }

  iconPath = {
    light: path.join(__dirname, 'media', 'npm-3.svg'),
    dark: path.join(__dirname, 'media', 'npm-3.svg')
  };
  
  contextValue = 'dependency-type';
}