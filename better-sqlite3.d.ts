declare module 'better-sqlite3' {
  interface Database {
    prepare(sql: string): Statement;
    exec(sql: string): void;
    pragma(pragma: string): void;
    close(): void;
  }

  interface Statement {
    run(...params: any[]): any;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    lastInsertRowid?: number;
  }

  function Database(filename: string, options?: any): Database;
  export default Database;
}



