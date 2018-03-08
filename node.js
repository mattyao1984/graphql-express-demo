'use strict';

const {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');
const { videoType } = require('./');

const nodeInterface = new GraphQLInterfaceType({
  name: 'Interface',
  description: 'My GraphQL interface',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolveType: (object) => {
    if (object.title) {
      return videoType;
    }

    return null;
  }
});

module.exports = nodeInterface;