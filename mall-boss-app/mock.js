const mock = (router) => {
  router.post('', (req, res) => {
    res.send({});
  });
};

module.exports = {
  mock,
};

