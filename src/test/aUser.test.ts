// // import app from "./server";

// // src/app.test.ts

// // describe('Test App.ts', () => {
// //     test('should be true', () => {
// //         expect(true).toBeTruthy();
// //     });
// //  });

// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import app from '../server';
// import pool from '../core/config/database'
// const { expect } = chai;
// chai.use(chaiHttp);



// const userUrl = 'api/v1/users'
// const taskUrl = 'api/v1/tasks'
// describe('API Tests', () => {
//     it('should create User', (done) => {
//       const user = {
//         firstName: 'gehazi',
//         lastName:   'Anning',
//         email: 'anning@gmail.com',
//         password: 'password123',
//         // Add other required fields as per your API documentation
//       };
  
//       chai.request(app)
//         .post('/api/v1/users/signup') // Use POST for creating users
//         .send(user) // Send user data in the request body
//         .end((err, res) => {
//             console.log('RESSSSSS:',res)
//           expect(err).to.be.null; // Check for errors
//           console.log('ERRRRORR:',err)
//           expect(res).to.have.status(201); // Expect status code 201 (Created)
//           // You can add assertions to check the response body if signup is successful
//           done();
//         });
//     });
//   });
  
// describe ('User Routes', () => {
//     it('should create user', async ()=>{
//         const result = await chai
//         .request(app())
//         .post(`${userUrl}/`)
//         .send({
//             data: {
//                 firstName: 'Comme Ci',
//                 lastName: 'Comme Ca',
//                 email: 'comme@gmail.com',
//                 password: 'Test123ew',
//             }
//         })
//         process.env.USER_TOKEN = result.body.data.token;
//         process.env.USER_ID = result.body.data.id;
//         expect(result.body).to.have.property('status', 'success');
//         expect(result.status).to.eql(201);
//     });
     
//     it('should create user', async ()=>{
//         const result = await chai
//         .request(app())
//         .post(`${userUrl}/`)
//         .send({
//             data: {
//                 firstName: 'Kofi',
//                 lastName: 'Amoah',
//                 email: 'amoah@gmail.com',
//                 password: 'Test1fer3',
//             }
//         })
//         process.env.USER_TOKEN = result.body.data.token;
//         process.env.USER_ID = result.body.data.id;
//         expect(result.body).to.have.property('status', 'success');
//         expect(result.status).to.eql(201);
//     })
// })


// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import app from '../server'; // Adjust the path as needed to import your Express app
// const { expect } = chai;

// chai.use(chaiHttp);
// describe('User Routes', function() {

//     it('should create a user successfully', (done) => {
//         const user = {
//             firstName: 'John',
//             lastName: 'Doe',
//             email: 'johndoe@example.com',
//             password: 'password123'
//         };

//         chai.request(app)
//             .post('/api/v1/users/signup')
//             .send(user)
//             .end((err, res) => {
//                 expect(err).to.be.null;
//                 expect(res).to.have.status(201);
//                 expect(res.body).to.have.property('message', 'User created successfully');
//                 expect(res.body.data).to.have.property('email', user.email);
//                 done();
//             });
//     });

//     it('should return error if user already exists', (done) => {
//         const user = {
//             firstName: 'John',
//             lastName: 'Doe',
//             email: 'johndoe@example.com',
//             password: 'password123'
//         };

//         chai.request(app)
//             .post('/api/v1/users/signup')
//             .send(user)
//             .end((err, res) => {
//                 expect(res).to.have.status(400);
//                 expect(res.body).to.have.property('message', 'User Already Exists');
//                 done();
//             });
//     });
// });import chaiHttp from "chai-http";import chai from 'chai';import chai from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import pool from '../core/config/database';
import { createNewUser, loginUser } from '../services/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userQueries from '../queries/user.query';

chai.use(chaiHttp);
chai.use(sinonChai);

const expect = chai.expect;

describe("User Routes", () => {
    let poolQueryStub: sinon.SinonStub;
    let bcryptCompareStub: sinon.SinonStub;
    let jwtSignStub: sinon.SinonStub;
    let bcryptHashStub: sinon.SinonStub;

    beforeEach(() => {
        poolQueryStub = sinon.stub(pool, "query");
        bcryptCompareStub = sinon.stub(bcrypt, "compare");
        jwtSignStub = sinon.stub(jwt, "sign");
        bcryptHashStub = sinon.stub(bcrypt, "hash");
    });

    afterEach(() => {
        poolQueryStub.restore();
        bcryptCompareStub.restore();
        jwtSignStub.restore();
        bcryptHashStub.restore();
    });

    it("should create a user successfully", async () => {
        const body = {
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            password: "password123"
        };

        const user = {
            id: "1",
            email: body.email
        };

        poolQueryStub.withArgs(userQueries.findUserByEmail, [body.email]).resolves({ rows: [] });
        bcryptHashStub.resolves("hashedpassword");
        poolQueryStub.withArgs(userQueries.createUser).resolves({ rows: [user] });

        const result = await createNewUser(body.firstName, body.lastName, body.email, body.password);

        expect(result).to.deep.equal(user);
        expect(poolQueryStub).to.have.been.calledWith(userQueries.createUser, [body.firstName, body.lastName, body.email, "hashedpassword", sinon.match.string]);
    });

    it("should fail to create a new user when email already exists", async () => {
        const body = {
            firstName: "Milli",
            lastName: "Belll",
            email: "millibelll@gmail.com",
            password: "12345678"
        };

        const existingUser = {
            id: "1",
            firstName: "Milli",
            lastName: "Belll",
            email: "millibelll@gmail.com",
            password: "hashedpassword",
            created_at: new Date(),
        };

        poolQueryStub.withArgs(userQueries.findUserByEmail, [body.email]).resolves({ rows: [existingUser] });

        try {
            await createNewUser(body.firstName, body.lastName, body.email, body.password);
        } catch (error: any) {
            expect(error.code).to.equal(400);
            expect(error.message).to.equal("User Already Exists");
        }

        expect(poolQueryStub).to.have.been.calledOnceWith(userQueries.findUserByEmail, [body.email]);
    });

    it("should log in a user successfully", async () => {
        const body = {
            email: "millibelll@gmail.com",
            password: "12345678",
        };

        const user = {
            id: "1",
            firstName: "Milli",
            lastName: "Belll",
            email: body.email,
            password: await bcrypt.hash(body.password, 12),
            created_at: new Date(),
        };

        const token = "sample.jwt.token";

        poolQueryStub.withArgs(userQueries.findUserByEmail, [body.email]).resolves({ rows: [user] });
        bcryptCompareStub.withArgs(body.password, user.password).resolves(true);
        jwtSignStub.returns(token);

        const result = await loginUser(body.email, body.password);

        expect(result).to.deep.equal({ user, token });
        expect(poolQueryStub).to.have.been.calledOnceWith(userQueries.findUserByEmail, [body.email]);
        expect(bcryptCompareStub).to.have.been.calledOnceWith(body.password, user.password);
        expect(jwtSignStub).to.have.been.calledOnce;
    });
});
