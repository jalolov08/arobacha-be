const User = require("../models/User");

async function followUser(req, res) {
  try {
    const currentUser = await User.findById(req.user._id);

    const userToFollow = await User.findOne({ username: req.params.username });

    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    if (currentUser.follows.includes(userToFollow._id)) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    currentUser.follows.push(userToFollow._id);
    await currentUser.save();

    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    res.status(200).json({ message: "Following successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function unfollowUser(req, res) {
  try {
    const currentUser = await User.findById(req.user._id);

    const userToUnfollow = await User.findOne({ username: req.params.username });

    if (!userToUnfollow) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!currentUser.follows.includes(userToUnfollow._id)) {
      return res
        .status(400)
        .json({ error: "You are not following this user" });
    }

    // Remove userToUnfollow from the follows array of currentUser
    currentUser.follows = currentUser.follows.filter(
      (userId) => userId.toString() !== userToUnfollow._id.toString()
    );
    await currentUser.save();

    // Remove currentUser from the followers array of userToUnfollow
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (userId) => userId.toString() !== currentUser._id.toString()
    );
    await userToUnfollow.save();

    res.status(200).json({ message: "Unfollowing successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getFollowsAndFollowers(req, res){
  try {
    const user = await User.findOne({username:req.params.username})
    res.status(200).json({follows:user.follows.length , followers:user.followers.length})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {
  followUser,
  unfollowUser,
  getFollowsAndFollowers
};
