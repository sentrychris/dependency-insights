import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Dependency } from './Dependency';
import { VersionCheck } from './VersionCheck';

export class DependencyProvider implements vscode.TreeDataProvider<Dependency> {
  
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;
  
  private versionCheck: VersionCheck = new VersionCheck;
  
  constructor(private workspaceRoot: string | undefined)
  {}
  
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
  
  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }
  
  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependency in empty workspace');
      return Promise.resolve([]);
    }
    
    if (element) {
      return Promise.resolve(this.fetchFromPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
    } else {
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      if (this.pathExists(packageJsonPath)) {
        return Promise.resolve(this.fetchFromPackageJson(packageJsonPath));
      } else {
        vscode.window.showInformationMessage('Workspace has no package.json');
        return Promise.resolve([]);
      }
    }
    
  }
  
  private fetchFromPackageJson(packageJsonPath: string): Dependency[] {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      const toDependency = (module: string, version: string): Dependency => {
        this.versionCheck.setInsight(module, version);
        
        if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', module))) {
          return new Dependency(module, version, vscode.TreeItemCollapsibleState.Collapsed);
        } else {
          return new Dependency(module, version, vscode.TreeItemCollapsibleState.None, {
            command: 'extension.openPackageOnNpm',
            title: '',
            arguments: [module]
          });
        }
      };
      
      const deps = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).map(dep => toDependency(dep, packageJson.dependencies[dep]))
        : [];
      
      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map(dep => toDependency(dep, packageJson.devDependencies[dep]))
        : [];
        
      return deps.concat(devDeps);
    } else {
      return [];
    }
  }
  
  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    
    return true;
  }
}