import pool from './dbConnection';



let poolConnection: any = async () => {

    const fromPromise = new Promise((resolve, reject) => {

        pool.connect((err: any) => {
            if(err){
                console.log('Entered an error from poolConnection: ', err);
                
                return reject(err);;
            }
        
            console.log('connected on threadId --> ' + pool.threadId);
        
            return resolve('Successful');
        });
    });
    
    
    const rowResult = await fromPromise as any;
}

export default poolConnection;

