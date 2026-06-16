import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

let dbInstance: Database | null = null;

export async function getDB() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(process.cwd(), '/db/balanco_cvm.db'), 
      driver: sqlite3.Database,
    });
    
    
  }
  return dbInstance;
}
