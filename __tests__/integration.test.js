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
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Not Found');
        })
    });
});

describe('/api', () => {
    test('GET: 200 should respond with an object that contains all available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe('object');
        })
    });
    test('GET: 200 each endpoint object should contain the same expected properties', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const endpointArr = [];
            for (const key in body) {
                endpointArr.push(body[key]);
            }
            endpointArr.forEach(() => {
                expect.objectContaining({
                    "description": expect.any(String),
                    "queries": expect.any(Array),
                    "exampleResponse": expect.any(Object)
                })
            })
        })
    });
    test('GET: 200 the returned object should match that of the json file', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpointsJson);
        })
    });
});

describe('/api/topics', () => {
    test('GET: 200 sends an array of topics to the client', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const {topics} = body;
            expect(topics.length).toBe(3);
            topics.forEach(() => {
                expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            })
        })
    });
});

xdescribe('/api/articles/:article_id', () => {
    test('GET: 200 responds with an object containing a singular article', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article).toMatchObject({
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
    test('GET: 400 sends an appropriate status and error message when sent an invalid ID', () => {
        return request(app)
        .get('/api/articles/apple')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad Request');
        })
    });
    test('GET: 404 sends an appropriate status and error message when given a resource that does not exist', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Not Found')
        })
    });
    test('PATCH: 200 sends back the article that has has its votes property changed', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes : 1 })
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            console.log('helloooooo');
        })
    });
    test('PATCH: 200 the sent object should be able to change the votes property of the article both positive and negative numbers', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes : -1 })
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            console.log('helloooooo');
        })
    });
    test('PATCH: 400 sends an appropriate status and response when passed an object with missing required fields', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({})
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad Request')
        })
    });
    test('PATCH: 400 sends an appropriate status and response when the required object fields are the wrong data type', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: 'Word' })
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad Request')
        })
    });
    test('PATCH: 400 sends an appropriate status and response when sent a number that is not an integer', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: 1.5 })
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad Request')
        })
    });
    test('PATCH: 400 sends an appropriate status and response when the inc_votes property of the sent object is 0', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: 0 })
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad Request')
        })
    });
    test('PATCH: 404 sends an appropriate status and response when provided with a valid path that does not exist', () => {
        return request(app)
        .patch('/api/articles/999')
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Article Not Found')
        })
    });
    test('PATCH: 400 sends an appropriate status and response when given an invalid article id', () => {
        return request(app)
        .patch('/api/articles/apple')
        .send({ inc_votes: 2 })
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad Request')
        })
    });
});

describe('/api/articles/:article_id/comments', () => {
    test('GET: 200 sends an array of comments that belong to the given article', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body;
            expect(comments.length).toBe(11);
            comments.forEach(() => {
                expect.objectContaining({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: 1,
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                })
            })
        })
    });
    test('GET: 200 the array should be correctly sorted', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body;
            expect(comments).toBeSorted('created_at', {ascending: true});
        })
    });
    test('GET: 200 sends back an empty array should the article have no comments', () => {
        return request(app)
        .get('/api/articles/7/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments).toEqual([]);
        })
    });
    test('GET: 400 sends an appropriate status and error message when an invalid id is used', () => {
        return request(app)
        .get('/api/articles/apple/comments')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Bad Request')
        })
    });
    test('GET: 404 sends an appropriate status and error when given a resource that does not exist', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Not Found')
        })
    })
})

describe('/api/articles', () => {
    test('GET: 200 responds with an array of article objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles.length).toBe(articleData.length);
            expect(articles.length).toBe(13);
            articles.forEach(() => {
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
    test('GET: 200 the sent array should be sorted by the created_at field with the oldest item being at index 0', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles).toBeSorted('created_at', {ascending: true});
        })
    });
});
