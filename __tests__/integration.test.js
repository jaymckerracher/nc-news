const request = require('supertest');
const app = require(`${__dirname}/../app`);
const db = require(`${__dirname}/../db/connection`);
const seed = require(`${__dirname}/../db/seeds/seed`);
const testData = require(`${__dirname}/../db/data/test-data/index`);

const endpointsJson = require(`${__dirname}/../endpoints`)

beforeEach(() => seed(testData));
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
            expect(topicsArr.length).toBe(3);
            topicsArr.forEach(() => {
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

describe('/api/articles/:article_id/comments', () => {
    test('GET 200: sends an array of comments that belong to the given article', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(11);
            body.forEach(() => {
                expect.objectContaining({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                })
            })
            expect(body).toBeSorted('created_at', {ascending: true})
            expect(body[0]).toMatchObject({
                comment_id: 9,
                body: 'Superficially charming',
                article_id: 1,
                author: 'icellusedkars',
                votes: 0,
                created_at: '2020-01-01T03:08:00.000Z'
            })
        })
    });
    test('GET 200: sends back an empty array should the article have no comments', () => {
        return request(app)
        .get('/api/articles/7/comments')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual([]);
        })
    });
    test('GET 400: sends an appropriate status and error message when an invalid id is used', () => {
        return request(app)
        .get('/api/articles/apple/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
    test('GET 404: sends an appropriate status and error when given a resource that does not exist', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });
});
