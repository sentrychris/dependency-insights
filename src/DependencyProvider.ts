import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window
} from 'vscode';
import { join } from 'path';
import { accessSync, readFileSync } from 'fs';
import { Dependency } from './Dependency';
import { VersionCheck } from './VersionCheck';
import { DependencyType } from './DependencyType';

const DEPENDENCIES = 'dependencies';
const DEV_DEPENDENCIES = 'dev dependencies';

export class DependencyProvider implements TreeDataProvider<DependencyType> {
  
  private _onDidChangeTreeData: EventEmitter<DependencyType | undefined | void> = new EventEmitter<DependencyType | undefined | void>();
  readonly onDidChangeTreeData: Event<DependencyType | undefined | void> = this._onDidChangeTreeData.event;
  
  private versionCheck: VersionCheck = new VersionCheck;
  
  constructor(private workspaceRoot: string | undefined)
  {}
  
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
  
  getTreeItem(element: DependencyType): TreeItem {
    return element;
  }
  
  getChildren(element?: DependencyType): Thenable<DependencyType[]> {
    if (! this.workspaceRoot) {
      window.showInformationMessage('No dependencies in empty workspace');
      return Promise.resolve([]);
    }
    
    if (element) {
      console.log({ element })
      const packageJsonPath = join(this.workspaceRoot, 'package.json');
      
      if (this.pathExists(packageJsonPath)) {
          return Promise.resolve(
            this.fetchFromPackageJson(packageJsonPath, element.label)
          );
      } else {
          window.showInformationMessage('Workspace has no package.json');
          return Promise.resolve([]);
      }
    } else {
      return Promise.resolve([
        new DependencyType('dependencies', TreeItemCollapsibleState.Expanded),
        new DependencyType('dev dependencies', TreeItemCollapsibleState.Expanded)
      ]);
    }
    
  }
  
  private fetchFromPackageJson(packageJsonPath: string, element: string): Dependency[] {
    console.log(packageJsonPath, element);
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      const toDependency = (module: string, version: string): Dependency => {
        const insight = this.versionCheck.setInsight(module, version);
        
        return new Dependency(module, version, insight, TreeItemCollapsibleState.None, {
          command: 'extension.openPackageOnNpm',
          title: '',
          arguments: [module]
        });
      };
      
      if (element === DEPENDENCIES) {
        return packageJson.dependencies
          ? Object.keys(packageJson.dependencies).map(dep => toDependency(dep, packageJson.dependencies[dep]))
          : [];
      }

      if (element === DEV_DEPENDENCIES) {
        return packageJson.devDependencies
          ? Object.keys(packageJson.devDependencies).map(dep => toDependency(dep, packageJson.devDependencies[dep]))
          : [];
      }
    } else {
      return [];
    }
  }
  
  private pathExists(p: string): boolean {
    try {
      accessSync(p);
    } catch (err) {
      return false;
    }
    
    return true;
  }
}