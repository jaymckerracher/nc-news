const request = require('supertest');
const app = require(`${__dirname}/../app`);
const db = require(`${__dirname}/../db/connection`);
const seed = require(`${__dirname}/../db/seeds/seed`);
const testData = require(`${__dirname}/../db/data/test-data/index`);

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/notAPath', () => {
    test('GET: 404 sends an appropriate status and error message when given an invalid path', () => {
        return request(app)
        .get('/notAPath')
        .expect(404)
    });
});

describe('/api', () => {
    test('GET: 200 should respond with an object that contains all available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(response => {
            expect(typeof response.body).toBe('object');
            const objArr = [];
            for (const key in response.body) {
                objArr.push(response.body[key]);
            }
            objArr.forEach(() => {
                expect.objectContaining({
                    "description": expect.any(String),
                    "queries": expect.any(Array),
                    "exampleResponse": expect.any(Object)
                })
            })
        })
    })
});

describe('/api/topics', () => {
    test('GET: 200 sends an array of topics to the client', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(response => {
            const topicsArr = response.body.topics
            expect(topicsArr.length).toBe(3); //length check
            topicsArr.forEach(() => { //object format check
                expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            })
        })
    });
});
