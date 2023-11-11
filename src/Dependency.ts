import * as path from 'path';
import * as vscode from 'vscode';

export class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private readonly version: string,
    public readonly insight: {latest: string, outdated: boolean},
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = insight.outdated
      ? `Update available: ${insight.latest}`
      : `Package is latest version`;

    this.description = this.version;
    if (insight.outdated) {
      this.description += ` ⇄ ^${insight.latest} (update available)`
    }
  }
    
  iconPath = {
    light: path.join(__dirname, 'media', 'npm-3.svg'),
    dark: path.join(__dirname, 'media', 'npm-3.svg')
  };
  
  contextValue = 'dependency';
}