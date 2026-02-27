declare module 'better-sqlite3' {
  interface Database {
    prepare(sql: string): any;
    exec(sql: string): void;
    pragma(pragma: string): void;
  }

  interface Statement {
    run(...params: any[]): any;
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  function Database(filename: string, options?: any): Database;
  export default Database;
}
