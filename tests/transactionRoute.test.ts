import supertest from 'supertest'
import { app } from '../src/server'
import { Request, Response } from 'express'
import pool from '../src/config/dbConnection';
import generateToken from '../src/config/generateToken';
import createTransfer from "../src/handlers/transactionHandler"


let getUsers = [
    {
        user_id: "xyz-xyz-xyz-xyz",
        email: "xxxxx@email.com",
        phone: "5555555555",
        password: "xxxxx"
    }, 
    {
        user_id: "yyz-xyz-xyz-xyz",
        email: "yyyyy@email.com",
        phone: "5555555555",
        password: "yyyyy"
    },
    {
        user_id: "zyz-xyz-xyz-xyz",
        email: "zzzzz@email.com",
        phone: "5555555555",
        password: "zzzzz"
    }
]


describe.skip("create a transfer transaction", () => {
    beforeAll(() => {  
        // db connection

        /* pool.getConnection((err: any, conn: any) => {
            pool.query('SELECT * FROM ? WHERE email=?', [getUsers, getUsers[0].email], (err: any, rows: any) => {

            });
        }); */

    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    const req = {
        auth: {},
        header: {
            "Authorization": generateToken('33333@email.com')
        },
        body: {
            "transactionType": "WALLET-TO-WALLET",
            "transactionAmount": 500,
            "senderWalletId": "a8fa95ff-d640-458f-8135-27031b382e9c",
            "receiverWalletId": "a69fff37-4c09-425e-8147-0f6c3b87b098"
        }      
    };


    const response = {}
   
    it("pop 404 error if sender wallet not found", async () => {
        
        const currentUserEmail = "33333@email.com";
        const token = generateToken(currentUserEmail);

        //createTransfer(request as Request, response as Response)
        //expect(response).toEqual()

        const res = await supertest(app).post('/transactions/transfer')
                        .set('Authorization', `Bearer ${token}`)
                        .send(req);

        expect(JSON.parse(res.text)).toStrictEqual({ message: 'Sender wallet not found', statusCode: 404 }); 
    })

    it("pop 403 error if logged in user not owner of sender wallet", async () => {
        
        const currentUserEmail = "11111@email.com";
        const token = generateToken(currentUserEmail);

        const res = await supertest(app).post('/transactions/transfer')
                        .set('Authorization', `Bearer ${token}`)
                        .send(req);

        expect(JSON.parse(res.text)).toStrictEqual({ message: 'Logged in User cannot transact with this wallet', statusCode: 403 }); 
    })

    it("pop 500 error if receiver wallet not validated successfully", async () => {
        
        const currentUserEmail = "11111@email.com";
        const token = generateToken(currentUserEmail);

        const res = await supertest(app).post('/transactions/transfer')
                        .set('Authorization', `Bearer ${token}`)
                        .send(req);

        expect(JSON.parse(res.text)).toStrictEqual({ message: 'Sender wallet not found', statusCode: 404 }); 
    })

    // not enough balance

    // successful transaction
})