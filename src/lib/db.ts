import { Database } from "bun:sqlite";

export type DbConf = {
    filename: string;
}

const dbConfDefault = {
    filename: './db/mydb.sqlite'
}

export const connectDb = async (dbConf?: DbConf) => {
    const { filename, ...options } = {
        ...dbConfDefault,
        ...dbConf || {}
    }

    console.log({ dbConf })

    // TODO! `mkdir -p ${path(dbConf.filename)}`

    const db = new Database(filename, {
        ...options,
        create: true
    });

    return db
}

export const setupDb = (db: Database, recreateDb: boolean) => {

    const tablenames = db
        .query(`
            SELECT name FROM sqlite_master 
            WHERE type='table'AND 
            name NOT LIKE 'sqlite_' || '%';
        `)
        .all()
        .map((row) => (row as { name: string}).name)

    console.log(`Tabels in db (${db.filename})`, tablenames.join(' | '))

    if (recreateDb) {
        console.log('Recreating tables...')

        tablenames.forEach(tablename => db
            .query(`DROP table '${tablename}';`)
            .run())

        db.query(`
        CREATE TABLE IF NOT EXISTS article (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          slug TEXT UNIQUE,
          title TEXT,
          content TEXT,
          is_published INTEGER
        );
        `).run()

        db.query(`
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          email TEXT UNIQUE,
          password TEXT UNIQUE          
        );
        `).run()

        console.log('Inserting dummy data')

        db.query(`
        INSERT INTO article (
          slug, title, content, is_published
        ) VALUES (
          'test-article', 'Test article', '<span>Test <b>article</b> content</span>', 1
        );        
        `).run()

        db.query(`
        INSERT INTO article (
          slug, title, content, is_published
        ) VALUES (
          'test-article-2', 'Test article 2', '<span>Test <b>article</b> 2 content</span>', 0
        );        
        `).run()


        db.query(`
        INSERT INTO user (
          email, password
        ) VALUES (
          'gnimmelf@gmail.com', 'flemming'
        );        
        `).run()


    }
}