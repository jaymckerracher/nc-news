const request = require('supertest');
const app = require(`${__dirname}/../app`);
const db = require(`${__dirname}/../db/connection`);
const seed = require(`${__dirname}/../db/seeds/seed`);
const {articleData, commentData, topicData, userData} = require(`${__dirname}/../db/data/test-data/index`);

const endpointsJson = require(`${__dirname}/../endpoints`)

beforeEach(() => seed({articleData, commentData, topicData, userData}));
afterAll(() => db.end());

describe('/notAPath', () => {
    test('GET: 404 sends an appropriate status and error message when given an invalid path', () => {
        return request(app)
        .get('/notAPath')
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe('Not Found');
        })
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
            expect(response.body).toEqual(endpointsJson)
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

describe('/api/articles/:article_id', () => {
    test('GET: 200 responds with an object containing a singular article', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(response => {
            expect(response.body.article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
        })
    });
    test('GET 400: sends an appropriate status and error message when sent an invalid ID', () => {
        return request(app)
        .get('/api/articles/apple')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request');
        })
    });
    test('GET 404: sends an appropriate status and error message when given a resource that does not exist', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe('Not Found')
        })
    });
});

describe('/api/articles', () => {
    test('GET 200: responds with an array of article objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(articleData.length);
            expect(body.length).toBe(13);
            for (let i=0; i<body.length - 1; i++) {
                expect(body[i].created_at > body[i + 1].created_at);
            }
            body.forEach(() => {
                expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    });
});
