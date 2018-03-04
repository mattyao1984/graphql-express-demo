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
];

const getVideoById = (id) => new Promise((resolve) => {
  const [video] = videos.filter(video => video.id === id);
  resolve(video);
});

const getVideos = () => new Promise((resolve) => resolve(videos));

const createVideo = ({ title, duration, watched }) => {
  const newVideo = {
    id: (new Buffer(title, 'utf8')).toString('base64'),
    title,
    duration,
    watched
  };

  videos.push(newVideo);
};

exports.getVideoById = getVideoById;
exports.getVideos = getVideos;
exports.createVideo = createVideo;