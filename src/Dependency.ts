import * as path from 'path';
import * as vscode from 'vscode';

export class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private readonly version: string,
    public readonly latest: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    const versionIsLatest = this.isLatest(version, latest);

    this.tooltip = ! versionIsLatest
      ? `Update available: ${this.latest}`
      : `Package is latest version`;

    this.description = this.version;
    if (! versionIsLatest) {
      this.description += ` ⇄ ^${this.latest} (update available)`
    }
  }

  isLatest (current: string, latest: string) {
    return (current.replace('^', '') === latest.replace('^', ''))
  }
    
  iconPath = {
    light: path.join(__dirname, 'media', 'npm-3.svg'),
    dark: path.join(__dirname, 'media', 'npm-3.svg')
  };
  
  contextValue = 'dependency';
}