import * as vscode from 'vscode';

export class TestMemento implements vscode.Memento {
  private storage: {[key: string]: any} = {};

  public get<T>(key: string): T|undefined;
  public get<T>(key: string, defaultValue: T): T;
  public get(key: any, defaultValue?: any) {
    if (this.containsKey(key)) {
      return this.storage[key];
    } else {
      return defaultValue;
    }
  }
  public update<T>(key: string, value: T): Thenable<void> {
    this.storage[key] = value;
    return Promise.resolve();
  }
  public containsKey(key: string): boolean { return this.storage.hasOwnProperty(key); }
  public clear() { this.storage = {}; }
}