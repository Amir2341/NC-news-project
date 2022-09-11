# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

Link to hosted version on [Heroku] (https://nc-news20.herokuapp.com/)

## Setup

1. Clone the repository from github

   `git clone https://github.com/Amir2341/NC-news-project.git`

2. create the two .env files

   `.env.development` should contain `PGDATABASE=nc_news`

   `.env.test` should contain `PGDATABASE=nc_news_test`

3. Install the dependancies

   `npm install`

4. create the test and development databases

   `npm run setup-dbs`

5. seed local database

   `npm run seed`

6. run the tests

   `npm test`

The minimum version of [Node.js] required is: v18.4.0 and the minimum version of [Postgres] required is: 14.3
