import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Dependency } from './Dependency';
import { VersionCheck } from './VersionCheck';
import { DependencyType } from './DependencyType';

const DEPENDENCIES = 'dependencies';
const DEV_DEPENDENCIES = 'dev dependencies';

export class DependencyProvider implements vscode.TreeDataProvider<DependencyType> {
  
  private _onDidChangeTreeData: vscode.EventEmitter<DependencyType | undefined | void> = new vscode.EventEmitter<DependencyType | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<DependencyType | undefined | void> = this._onDidChangeTreeData.event;
  
  private versionCheck: VersionCheck = new VersionCheck;
  
  constructor(private workspaceRoot: string | undefined)
  {}
  
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
  
  getTreeItem(element: DependencyType): vscode.TreeItem {
    return element;
  }
  
  getChildren(element?: DependencyType): Thenable<DependencyType[]> {
    if (! this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependencies in empty workspace');
      return Promise.resolve([]);
    }
    
    if (element) {
      console.log({ element })
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      
      if (this.pathExists(packageJsonPath)) {
          return Promise.resolve(
            this.fetchFromPackageJson(packageJsonPath, element.label)
          );
      } else {
          vscode.window.showInformationMessage('Workspace has no package.json');
          return Promise.resolve([]);
      }
    } else {
      return Promise.resolve([
        new DependencyType('dependencies', vscode.TreeItemCollapsibleState.Collapsed),
        new DependencyType('dev dependencies', vscode.TreeItemCollapsibleState.Collapsed)
      ]);
    }
    
  }
  
  private fetchFromPackageJson(packageJsonPath: string, element: string): Dependency[] {
    console.log(packageJsonPath, element);
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      const toDependency = (module: string, version: string): Dependency => {
        const latest = this.versionCheck.setInsight(module, version);
        
        return new Dependency(module, version, latest, vscode.TreeItemCollapsibleState.None, {
          command: 'extension.openPackageOnNpm',
          title: '',
          arguments: [module]
        });
      };
      
      const deps = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).map(dep => toDependency(dep, packageJson.dependencies[dep]))
        : [];
      
      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map(dep => toDependency(dep, packageJson.devDependencies[dep]))
        : [];

      console.log({ deps, devDeps, element });

      return element === DEPENDENCIES ? deps : devDeps;
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