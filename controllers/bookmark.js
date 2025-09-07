const bookmarkModel = require("../models/bookmark.model");
const { sendError, sendSuccess } = require("../utils/response");

module.exports.addBookmark = async (req, res) => {
  const { subjectId } = req.params;
  const user = req.user;

  try {
    const newBookmark = await bookmarkModel.create({
      subjectId,
      userId: user._id,
    });
    sendSuccess(res, 200, true, "Successfully added bookmark", {
      bookmark: newBookmark,
    });
  } catch (error) {
    sendError(res, 400, false, "Error on adding bookmark", {
      message: error.message,
    });
  }
};

module.exports.getBookmarks = async (req, res) => {
  const { userId } = req.params;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  try {
    const bookmarks = await bookmarkModel
      .find({ userId })
      .skip(skip)
      .limit(limit);
    if (!bookmarks)
      return sendError(
        res,
        404,
        false,
        "Error on getting bookmark(not found)",
        {}
      );
    const total = await bookmarkModel.countDocuments({ userId });
    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, 200, true, "successfully get bookmarks", {
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasprev: page > 1,
        hasNext: page < totalPages,
      },
    });
  } catch (error) {
    sendError(res, 400, false, "Error on getting bookmark", {
      message: error.message,
    });
  }
};
