'use strict';

const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
type Video {
  id: ID,
  title: String,
  duration: Int,
  watched: Boolean
}

type Query {
  video: Video
  videos: [Video]
}

type schema {
  query: Query
}
`);

const videos = [
  {
    id: '1',
    title: 'Video A',
    duration: 10000,
    watched: false
  }, {
    id: '2',
    title: 'Video B',
    duration: 50000,
    watched: false
  }
]

const resolvers = {
  video: () => ({
    id: '1',
    title: 'Author',
    duration: 5000,
    watched: true
  }),
  videos: () => videos
};

const query = `
query myFirstQuery {
  video {
    id
    title
    duration
    watched
  }
  videos {
    id
    title
    duration
    watched
  }
} 
`;

graphql(schema, query, resolvers)
  .then(res => {
    console.log('result: ', res);
  })
  .catch(error => {
    console.log('error: ', error);
  });