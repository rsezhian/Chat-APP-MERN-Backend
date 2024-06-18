//
const messageModel = require("../models/messageModel");

// add message from the user
module.exports.addMessage = async (req, res, next) => {
  try {
    // console.log("addMessage");
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "message added successfully" });
    return res.json({ msg: "failed to add message to the database" });
  } catch (error) {
    next(error);
  }
};

// get all messages from the user
module.exports.getAllMessage = async (req, res, next) => {
  try {
    // console.log("getAllMessage");
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
    // console.log("projectedMessages:" + projectedMessages);
  } catch (error) {
    next(error);
  }
};
