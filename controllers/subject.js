const subjectModel = require("../models/subject.model");
const unitModel = require("../models/unit.model");
const { sendSuccess, sendError } = require("../utils/response");
const supabase = require("../config/supabase");
const { json } = require("express");

const addSubject = async (req, res) => {
  const { title, description, tags, keywords } = req.body;
  const file = req.file;
  try {
    let newSubject = await subjectModel.create({
      title,
      description,
      tags: JSON.parse(tags) || [],
      keywords: JSON.parse(keywords) || [],
      img: {
        data: file.buffer.toString("base64"),
        contentType: file.mimetype,
      },
    });
    sendSuccess(res, 201, true, "Successfully created subject.", {
      created_subject: newSubject,
    });
  } catch (error) {
    sendError(res, 400, false, "Error on creating subject", { error });
  }
};

const getSubjects = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const subjects = await subjectModel.find().skip(skip).limit(limit).sort({createdAt: -1});

    const total = await subjectModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, 200, true, "Successfully get subjects", {
      subjects,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
      },
    });
  } catch (error) {
    sendError(res, 404, false, "Error on getting subject", { error });
  }
};

const getOneSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await subjectModel.findById(id);
    if (!subject)
      return sendError(res, 404, false, "Requested subject not found.", {});

    sendSuccess(res, 200, true, "Found successfully.", { subject });
  } catch (error) {
    sendError(res, 400, false, "There is an error on getting one subject.", {
      error,
    });
  }
};

const updateSubject = async (req, res) => {
  const { title, description, tags, keywords } = req.body;
  const { id } = req.params;

  try {
    const subject = await subjectModel.findByIdAndUpdate(id, {
      title,
      description,
      tags,
      keywords,
    });
    if (!subject) {
      return sendError(
        res,
        400,
        false,
        "There is an error on updating the subject."
      );
    }
    sendSuccess(res, 200, true, "Updated successfully", { subject });
  } catch (error) {
    sendError(res, 400, false, "Error on updating the ");
  }
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await subjectModel.findById(id);
    if (!subject) {
      return sendError(res, 404, false, "Subject not found", {});
    }

    const { data, error } = await supabase.storage
      .from("notelab")
      .list(subject._id, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      return sendError(
        res,
        404,
        false,
        "There is an error on finding subject files in storage."
      );
    }

    if (data.length === 0) {
      await subjectModel.findByIdAndDelete(id);
      return sendSuccess(res, 200, true, "Successfully deleted subject.", {
        subject,
      });
    }

    const filesArray = data.map((file) => {
      return subject._id + "/" + file.name;
    });

    const filesData = await supabase.storage.from("notelab").remove(filesArray);

    if (filesData.error) {
      return sendError(
        res,
        400,
        false,
        "error on deleting files from storage",
        {}
      );
    }

    await unitModel.deleteMany({ subjectId: subject._id });
    await subjectModel.findByIdAndDelete(id);

    sendSuccess(res, 200, true, "Successfully deleted subject.", { subject });
  } catch (error) {
    sendError(res, 400,false, "Error on deleting subject", { error });
  }
};

const getSubjectsList = async (req, res) => {
  try {
    const subjects = await subjectModel.find();
    sendSuccess(res, 200, true, "Got list successfully.", { list: subjects });
  } catch (error) {
    sendError(res, 400, false, "Error on getting list of subjects.", { error });
  }
};

const querySearch = async (req, res) => {
  const query = req.query.q;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  if (!query) return sendError(res, 400, false, "Query required", {});
  try {
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { keywords: { $regex: query, $options: "i" } },
      ],
    };

    const result = await subjectModel.find(searchQuery)
      .skip(skip)
      .limit(limit);
    const total = await subjectModel.countDocuments(searchQuery);
    const totalPages =Math.ceil(total / limit)
      sendSuccess(res, 200, true, "Search Successfully", {
        subjects: result,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasPrev: page > 1,
          hasNext: page< totalPages,
        },
      });
  } catch (error) {
    sendError(res, 400, false, "Failed to seach", { message: error.message});
  }
};

module.exports = {
  addSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  getSubjectsList,
  getOneSubject,
  querySearch,
};
