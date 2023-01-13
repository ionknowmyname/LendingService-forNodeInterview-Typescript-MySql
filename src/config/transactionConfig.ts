import pool from '../config/dbConnection';

// Not using this file at all, this is just a possible solution using mysql.createPool 
// as opposed to what I'm using currently in this branch, which is mysql.createConnection

let inTransaction: any = (pool: any, body: any, callback: any) => {
    withConnection(pool, (db: any, done: any) => {

        db.beginTransaction((err: any) => {
            if (err) return done(err);

            body(db, finished)
        })

        // Commit or rollback transaction, then proxy callback
        function finished(this: any, err: any) {
            var context = this;
            var args = arguments;

            if (err) {
                if (err == 'rollback') {
                    args[0] = err = null;
                }
                db.rollback(() => { done.apply(context, args) });
            } else {
                db.commit((err: any) => {
                    args[0] = err;
                    done.apply(context, args)
                })
            }
        }
    }, callback)
}

function withConnection(pool: any, body: any, callback: any) {
    pool.getConnection((err: any, db: any) => {
        if (err) return callback(err);

        function finished(this: any) {
            db.release();
            callback.apply(this, arguments);
        }

        body(db, finished);

        // function finished() {
        //     db.release();
        //     callback.apply(this, arguments);
        // }
    })
}

export { inTransaction };;