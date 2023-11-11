import { join } from 'path';
import { Command, TreeItem, TreeItemCollapsibleState } from 'vscode';

export class DependencyType extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command
  ) {
    super(label, collapsibleState);
  }

  iconPath = {
    light: join(__dirname, 'media', 'npm-3.svg'),
    dark: join(__dirname, 'media', 'npm-3.svg')
  };
  
  contextValue = 'dependency-type';
}