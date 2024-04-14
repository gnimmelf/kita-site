import { Database } from "bun:sqlite";
import { Elysia } from 'elysia';

export type DbConf = {
    filename: string;
}

const dbConfDefault = {
    filename: './mydb.sqlite'
}

export const connectDb = async (dbConf: DbConf) => {
    const { filename, ...options} = {
        ...dbConfDefault,
        ...dbConf
    }
    const db = new Database(filename, { 
        ...options,
        create: true 
    });

    const data = db
        .query(`
            SELECT name FROM sqlite_master 
            WHERE type='table' 
            AND 
            name NOT LIKE 'sqlite_' || '%';
        `)
        .all()

    console.log(`Tabels in db (${filename})`, data.map(({ name }) => name).join(' | '))

    if (!data.length) {
        console.log('Creating tables...')
        db.query(`
        CREATE TABLE IF NOT EXISTS article (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          slug TEXT UNIQUE,
          title TEXT UNIQUE,
          content TEXT
        );
      `).run()

        console.log('Inserting dummy data')
        db.query(`
        INSERT INTO article (
          slug, title, content
        ) VALUES (
          'test-article', 'Test article', '<span>Test <b>article</b> content</span>'
        );
      `).run()
    }

    return db
}