const unitModel = require("../models/unit.model");
const { sendSuccess, sendError } = require("../utils/response");
const supabase = require("../config/supabase");


const addUnit = async (req, res) => {
  const { subjectId } = req.params;
  const { name } = req.body;
  const file = req.file;

  try {
    const { data, error } = await supabase.storage
      .from("notelab")
      .upload(subjectId + "/" + file.originalname, file.buffer);

    if (error) {
      console.log(error);
      return sendError(res, 400, false, "Error on adding unit.", { error });
    }

    const new_unit = await unitModel.create({
      name,
      subjectId,
      filePath: data.path,
    });

    sendSuccess(res, 201, true, "Successfully created unit.", { new_unit });
  } catch (error) {
    console.log(error)
    sendError(res, 400, false, "Error on adding unit.", { error });
  }
};

const getUnits = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const units = await unitModel.find({ subjectId  });

    sendSuccess(res, 200, true, "Successfully get units", { units });
  } catch (error) {
    sendError(res, 400, false, "Error on geting units", {error})
  }
};

const updateUnit = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const unit = await unitModel.findById(id);
    if (!unit) return console.log("unit not found");
    if (name) unit.name = name;
    await unit.save();
    sendSuccess(res, 200, true, "Successfully updated");
  } catch (error) {
    sendError(res, 400, "Error on updating", {});
  }
};

const deleteUnit = async (req, res) => {
  const { id } = req.params;

  try {
    const unit = await unitModel.findById(id);
    if (!unit) return console.log("unit not found");

    const { data, error } = await supabase.storage
      .from("notelab")
      .remove(unit.filePath);
    if (error) {
      return sendError(res, 400, "Error on deleting url", { error });
    }

    await unitModel.findByIdAndDelete(id);

    sendSuccess(res, 200, true, "Deleted successfully.");
  } catch (error) {
    sendError(res, 400, "Error on deleting unit.", {});
  }
};

const getUrl = async (req, res) => {
  const { id } = req.params;

  try {
    const unit = await unitModel.findById(id);

    if (!unit)
      return sendError(res, 404, false, "Unit not found in database.", {});

    const path = unit.filePath;
    const { data, error } = await supabase.storage
      .from("notelab")
      .createSignedUrl(path, 120);

    if (error)
      return sendError(res, 400, false, "Error on getting url from storage.", {
        error,
      });

    sendSuccess(res, 200, true, "Got url successfully.", {
      url: data.signedUrl,
    });
  } catch (error) {
    sendError(res, 400, "Error on getting unit url.", {});
  }
};

module.exports = { addUnit, getUnits, updateUnit, deleteUnit, getUrl };
