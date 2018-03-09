'use strict';

const express = require('express');
const graphqlHttp = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');
const { getVideoById, getVideos, createVideo } = require('./controllers/video.controller');

const myInterface = require('./node');   // normal interface

const {
  globalIdField,
  connectionDefinitions,
  connectionFromPromisedArray,
  connectionArgs
} = require('graphql-relay');
const { nodeInterface, nodeField } = require('./relay-interface');  // Relay interface

const PORT = process.env.port || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'video',
  description: 'A video query type.',
  fields: {
    id: globalIdField(),
    title: {
      type: GraphQLString,
      description: 'The title of the video'
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video'
    },
    watched: {
      type: GraphQLBoolean,
      description: 'The status of the video'
    }
  },
  interfaces: [nodeInterface]
});
exports.videoType = videoType;

const { connectionType: videoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Total count of videos',
      resolve: (conn) => conn.edges.length
    }
  })
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    node: nodeField,
    videos: {
      type: videoConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(
        getVideos(),
        args
      )
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the video'
        }
      },
      resolve: (_, args) => getVideoById(args.id)
    }
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Mutation demo of the video',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'video title'
        },
        duration: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'video duration'
        },
        watched: {
          type: new GraphQLNonNull(GraphQLBoolean),
          description: 'video watched status'
        }
      },
      resolve: (_, args) => createVideo(args)
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

server.use('/graphql-data', graphqlHttp({
  schema,
  graphiql: true
}));

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});