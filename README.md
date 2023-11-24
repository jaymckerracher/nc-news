# Northcoders News API

## Link to the hosted API
https://jay-mckerracher-nc-news.onrender.com/api

## Summary
This is my solo backend project for the Northcoders bootcamp. Throughout this weeklong period, I have created and hosted my own API using technologies such as the Express framework, node-postgres, supertest and more. I have built this API using a combination of JavaScript and SQL, and have been able to host it by using both elephantSQL and Render.

This API has a range of available endpoints, some of which are accepting of parameters and queries. All available endpoints should be visible when you visit the link above, with a description of each endpoint, an array of queries that can be added to the path and an example of what response you can expect to receive.

I want to thank all of the staff members at Northcoders for providing me with the opportunity to be a part of their Software Development bootcamp. I want to especially thank all of the mentors for providing me with the education and information needed to create this project, I have thoroughly enjoyed making it!

## How to access this project
Please follow the steps below to correctly access the source code for this project:

### Cloning the repo
In your command line, please navigate to the location of where you want to store the root directory for this project. When you are in the desired location, please run the following command:
- *git clone https://github.com/jaymckerracher/nc-news.git*
This will make a clone of the repo on your local machine.

## Setting up this project
Please also follow the steps below to correctly set up the project:

### Creating the .env files
For this project, you will have to create your own .env files that contain the relevent environment variables - this is necessary to be able to connect to the databases.

In the root directory of this project, please create the following files:
- .env.test
- .env.development
- .env.production

Within the .test file, please write the following code:
- PGDATABASE=nc_news_test

Within the .development file, please write the following code:
- PGDATABASE=nc_news

And finally, within the .production file, please write the following code:
- DATABASE_URL=postgres://jnrbmuxu:oXv2WphoMsfyjcxAmu0HgikhCZKxvHiP@surus.db.elephantsql.com/jnrbmuxu

### Installing dependencies
Inside the root directory, please run the following commands to install the dependencies that are needed to successfully run this project:
- *npm install*

### Setting up and seeding the databases locally
To have the databases on your local machine, please run the following commands **(note: you must have PSQL installed in order to complete this step)**:
- *npm run setup-dbs*
- *npm run seed*

## How to run tests
If you would like to run the tests for this project, you can use the following command:
- *npm t*

## Minimum required versions to run this project
- Node.js: v20.5.0
- Postgres: 14.9 (Homebrew), server 16.1