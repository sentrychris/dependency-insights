import { execSync } from 'child_process';

export class VersionCheck {

  constructor() {}
  
  public setInsight (module: string, version: string) {
    const stdout = execSync(`npm view ${module} version`, {
      encoding: 'utf-8'
    });

    if (stdout) {
      const latest = stdout.trim();

      if (latest !== '') {
        if (this.checkVersion(version.replace('^', ''), latest) < 0) {
          console.log(`${module} is outdated, current version: ${version.replace('^', '')}, latest: ${latest}`)
        }

        return latest;
      }
    }
  }
  
  private checkVersion(currentVersion: string, nextVersion: string): number {
    const currentVersionParts = currentVersion.split('.');
    const nextVersionParts = nextVersion.split('.');
    
    const validateParts = (parts: Array<string>) => {
      for (let i = 0; i < parts.length; ++i) {
        if (!/^\d+$/.test(parts[i])) {
          return false;
        }
      }
      
      return true;
    }
    
    if (!validateParts(currentVersionParts) || !validateParts(nextVersionParts)) {
      return NaN;
    }
    
    for (let i = 0; i < currentVersionParts.length; ++i) {
      if (nextVersionParts.length === i) {
        return 1;
      }
      
      if (currentVersionParts[i] === nextVersionParts[i]) {
        continue;
      }
      
      if (currentVersionParts[i] > nextVersionParts[i]) {
        return 1;
      }
      
      return -1;
    }
    
    if (currentVersionParts.length != nextVersionParts.length) {
      return -1;
    }
    
    return 0;
  }
}