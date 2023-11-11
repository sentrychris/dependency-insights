import { Command, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { join } from 'path';

export class Dependency extends TreeItem {
  constructor(
    public readonly label: string,
    private readonly version: string,
    public readonly insight: {latest: string, outdated: boolean},
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command
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
    light: join(__dirname, 'media', 'npm-3.svg'),
    dark: join(__dirname, 'media', 'npm-3.svg')
  };
  
  contextValue = 'dependency';
}