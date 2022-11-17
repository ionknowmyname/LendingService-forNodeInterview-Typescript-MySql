import supertest from 'supertest'
import { Request, Response } from 'express';
import { app } from '../src/server'
import pool from '../src/config/dbConnection';
import createWallet from '../src/handlers/walletHandler'
import generateToken from '../src/config/generateToken';



test.skip("Initial fail test", () => {
    expect(2).toEqual(3);
});


describe("create wallet for user", () => {

    beforeAll(() => {  // beforeEach
        /* mockResponse = {
          status: jest.fn(),
          json: jest.fn(),
        }; */

        // db connection
        /* pool.getConnection((err: any, conn: any) => {

        }); */

        // (pool as any).getConnection = jest.fn().mockReturnThis();

    });

    afterAll(() => {
        jest.resetAllMocks();
    });
   
    it.skip("pop 404 error if user not found", async () => {
        // (pool as any).query.mockResolvedValueOnce({
        //     rows: [],
        // });

        

        const currentUserEmail = "wronguser@email.com";
        const token = generateToken(currentUserEmail);

        const res = await supertest(app).post('/wallets/create')
                            .set('Authorization', `Bearer ${token}`);

        expect(JSON.parse(res.text)).toStrictEqual({ message: 'User not found', statusCode: 404 });   
        // toMatchObject
 
        /* 
        const { statusCode } = await supertest(app).post('wallets/create')
                            .set('Authorization', `Bearer ${token}`);    // , message 

        expect(statusCode).toBe(404); 
        expect(message).toBe('User not found');
        */
    })

    it.skip("pop 409 error if user has wallet", async () => {

        /* (pool as any).query.mockResolvedValueOnce({
            rows: [
              {
                v2: "EHRBFK76TGSMD",
                v3: "355GG",
                v4: "355GG",
                v1: "Q923892GT",
              },
            ],
          }); 
          
        */

        const currentUserEmail = "11111@email.com";  // already has wallet
        const token = generateToken(currentUserEmail);

        const res = await supertest(app).post('/wallets/create')
                            .set('Authorization', `Bearer ${token}`);

        expect(JSON.parse(res.text)).toStrictEqual({ message: 'User already has a wallet', statusCode: 409 });
    })

    const newUser = {
        user_id: "xyz-xyz-xyz-xyz",
        email: "34343@email.com",
        phone: "5555555555",
        password: "34343"
    }

    it("creates wallet successfully with 200 statusCode", async () => {

        
        (pool as any).query = jest.fn().mockReturnThis();
        (pool as any).release = jest.fn().mockReturnThis();
        const testing = (pool as any).query.mockResolvedValueOnce({  // mockResolvedValueOnce
            rows: [
                /* {
                    user_id: "xyz-xyz-xyz-xyz",
                    email: "34343@email.com",
                    phone: "5555555555",
                    password: "34343"
                } */
            ],
        });

        console.log("testing --> " + testing);
        

       /*  const req = {};
        const res = {}; */

        // const result = createWallet(req as Request, res as Response);


        const currentUserEmail = newUser.email;
        const token = generateToken(currentUserEmail); // mock process

        const res = await supertest(app).post('/wallets/create')
                        .set('Authorization', `Bearer ${token}`);

        expect((pool as any).query).toBeCalledWith('SELECT * FROM users WHERE email=?');
        // expect((pool as any).query).toBeCalledWith('SELECT * FROM wallets WHERE user_id=?');

        // expect(JSON.parse(res.text)).toStrictEqual({ message: 'Successul', statusCode: 200 }); 
    })
})

