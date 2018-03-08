const { getVideoById } = require('./video.controller');

const getObjectById = (type, id) => {
  const types = {
    video: getVideoById,
  };

  return types[type](id);
};

exports.getObjectById = getObjectById;