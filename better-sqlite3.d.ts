declare module 'better-sqlite3' {
  class Database {
    constructor(filename: string, options?: { readonly?: boolean; fileMustExist?: boolean; timeout?: number; verbose?: any });
    prepare(sql: string): Statement;
    exec(sql: string): void;
    pragma(pragma: string): any;
    close(): void;
  }

  interface Statement {
    run(...params: any[]): RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  interface RunResult {
    changes: number;
    lastInsertRowid: number;
  }

  export = Database;
}
