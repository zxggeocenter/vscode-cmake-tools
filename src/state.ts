import * as vscode from 'vscode';

/**
 * This class keeps track of all state that needs to persist between sessions
 * within a single workspace. Objects that wish to persist state should store
 * it here to ensure that we keep state consistent.
 *
 * This uses VSCode's Memento objects to ensure consistency. The user cannot
 * easily modify the contents of a Memento, so we can be sure that the contents
 * won't be torn or invalid, unless we make them that way. This class prevents
 * invalid states.
 */
export class StateManager {
  constructor(readonly extensionContext: vscode.ExtensionContext, public readonly subKey: string) {}

  /**
   * The name of the workspace-local active kit.
   */
  get activeKitName(): string|null {
    const kit = this.extensionContext.workspaceState.get<string>(`${this.subKey}/activeKitName`);
    return kit || null;
  }
  setActiveKitName(v: string|null) { return this.extensionContext.workspaceState.update(`${this.subKey}/activeKitName`, v); }

  /**
   * The currently select build target
   */
  get defaultBuildTarget(): string|null {
    const target = this.extensionContext.workspaceState.get<string>(`${this.subKey}/activeBuildTarget`);
    return target || null;
  }
  setDefaultBuildTarget(s: string|null) { return this.extensionContext.workspaceState.update(`${this.subKey}/activeBuildTarget`, s); }

  get launchTargetName(): string|null {
    const name = this.extensionContext.workspaceState.get<string>(`${this.subKey}/launchTargetName`);
    return name || null;
  }
  setLaunchTargetName(t: string|null) { return this.extensionContext.workspaceState.update(`${this.subKey}/launchTargetName`, t); }

  /**
   * The keyword settings for the build variant
   */
  get activeVariantSettings(): Map<string, string>|null {
    const pairs = this.extensionContext.workspaceState.get<[string, string][]>(`${this.subKey}/activeVariantSettings`);
    if (pairs) {
      return new Map<string, string>(pairs);
    } else {
      return null;
    }
  }
  setActiveVariantSettings(settings: Map<string, string>|null) {
    if (settings) {
      const pairs: [string, string][] = Array.from(settings.entries());
      return this.extensionContext.workspaceState.update(`${this.subKey}/activeVariantSettings`, pairs);
    } else {
      return this.extensionContext.workspaceState.update(`${this.subKey}/activeVariantSettings`, null);
    }
  }

  /**
   * The name of the CMake project for this workspace
   */
  get projectName(): string|null {
    const name = this.extensionContext.workspaceState.get<string>(`${this.subKey}/projectName`);
    return name || null;
  }
  setProjectName(s: string|null) { return this.extensionContext.workspaceState.update(`${this.subKey}/projectName`, s); }

  /**
   * Rest all current workspace state. Mostly for troubleshooting
   */
  async reset() {
    await this.setActiveVariantSettings(null);
    await this.setLaunchTargetName(null);
    await this.setDefaultBuildTarget(null);
    await this.setActiveKitName(null);
  }
}
