import supertest from 'supertest'
import { app } from '../src/server'
import pool from '../src/config/dbConnection';
import walletRoute from '../src/routes/walletRoute'



test("Initial fail test", () => {
    expect(2).toEqual(3);
});


describe("create wallet for user", () => {

    beforeEach(() => {
        /* mockResponse = {
          status: jest.fn(),
          json: jest.fn(),
        }; */

        const currentUserEmail = "wrongemail@gmail.com"
    });

    afterAll(() => {
        jest.resetAllMocks();
    });
   
    it("pop error if user not found", async () => {
        (pool as any).query.mockResolvedValueOnce({
            rows: [],
        });

        const res = await supertest(app).get('wallets/create')


        expect(res.body).toContain({ message: 'User not found', statusCode: 404 });
        // toMatchObject
    })

    it("pop error if user has wallet", () => {
        // create sample wallet

        (pool as any).query.mockResolvedValueOnce({
            rows: [
              {
                v2: "EHRBFK76TGSMD",
                v3: "355GG",
                v4: "355GG",
                v1: "Q923892GT",
              },
            ],
          });
    })

    it("creates wallet successfully", () => {

    })
})

