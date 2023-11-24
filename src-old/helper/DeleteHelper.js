const PipelineModel = require("../modules/pipeline/PipelineModel");
const StageModel = require("../modules/stage/StageModel");
const DealModel = require("../modules/deal/DealModel");
const FileModel = require("../modules/file/FileModel");
const ActivityModel = require("../modules/activity/ActivityModel");
const NoteModel = require("../modules/note/NoteModel");

const fs = require("fs");

async function deletePipeline(id) {
  const pipeline = await PipelineModel.findById(id).select("_id");
  await deleteStages(pipeline.id);
  await pipeline.deleteOne();
}

async function deleteStages(pipelineId) {
  const stages = await StageModel.find({ pipelineId }).select("_id");
  stages.length > 0 &&
    stages.forEach(async (stage) => {
      await deleteDeals(stage.id);
      await stage.deleteOne();
    });
}

async function deleteDeals(stageId) {
  const deals = await DealModel.find({ currentStage: stageId }).select("_id");

  const deleteTasks = [
    deleteFiles(deals),
    deleteActivities(deals),
    deleteNotes(deals),
  ];

  await Promise.all(deleteTasks);
  await DealModel.deleteMany({ _id: { $in: deals } });
}

async function deleteFiles(deals) {
  const files = await FileModel.find({ dealId: { $in: deals } });
  files.forEach(async (file) => {
    fs.unlink("public/uploads/" + file.name, async () => {
      await file.deleteOne();
    });
  });
}
async function deleteActivities(deals) {
  await ActivityModel.deleteMany({ deals: { $in: deals } });
}
async function deleteNotes(deals) {
  await NoteModel.deleteMany({ deals: { $in: deals } });
}

module.exports = {
  deletePipeline,
  deleteStages,
  deleteDeals,
  deleteFiles,
  deleteActivities,
  deleteNotes,
};
