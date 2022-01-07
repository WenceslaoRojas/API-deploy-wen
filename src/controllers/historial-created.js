const { Post, User } = require("../db");

module.exports = {
  createdHistorial: async function (username, roadMap) {
    try {
      const toDay = new Date().slice(0, 19).replace("T", " ");
      const foundUser = await User.findOne({
        where: { user: username },
      });

      const foundPost = await Post.findOne({
        where: { roadMap: roadMap },
      });
      if (!foundUser)
        return res.status(404).send({ msg: `${username} not found` });
      if (!foundPost)
        return res.status(404).send({ msg: `${roadMap} not found` });
      const foundUserByPk = await User.findByPk(foundUser.id);
      const foundPostByPk = await Post.findByPk(foundPost.id);
      const historialCreated = await Post.create({
        date: toDay,
      });
      await historialCreated.setUser(foundUserByPk);
      await historialCreated.setUser(foundPostByPk);
    } catch (err) {
      return res
        .status(404)
        .send({ error: err, message: "Error creating history" });
    }
  },
};
