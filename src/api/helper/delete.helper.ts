import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function deletePipeline(pipelineId: string) {
  await deleteStages(pipelineId);
  await prisma.pipeline.delete({
    where: {
      id: pipelineId,
    },
  });
}

export async function deleteStages(pipelineId: string) {
  const stages = await prisma.stage.findMany({
    where: { pipelineId },
    select: {
      id: true,
    },
  });
  stages.length > 0 &&
    stages.forEach(async (stage) => {
      await deleteDeals(stage.id);
      await prisma.stage.delete({ where: { id: stage.id } });
    });
}

export async function deleteDeals(stageId: string) {
  const deals = await prisma.deal.findMany({
    where: {
      currentStageId: stageId,
    },
    select: { id: true },
  });

  const dealIDsArr = deals.map((e) => e.id);

  const deleteTasks = [
    // deleteFiles(deals),
    deleteActivities(dealIDsArr),
    deleteNotes(dealIDsArr),
  ];

  await Promise.all(deleteTasks);
  await prisma.deal.deleteMany({ where: { currentStageId: stageId } });
}

// export async function deleteFiles(deals) {
//   const files = await FileModel.find({ dealId: { $in: deals } });
//   files.forEach(async (file) => {
//     fs.unlink("public/uploads/" + file.name, async () => {
//       await file.deleteOne();
//     });
//   });
// }

export async function deleteActivities(dealIds: string[]) {
  await prisma.activity.deleteMany({
    where: { deals: { hasSome: dealIds } },
  });
}
export async function deleteNotes(dealIds: string[]) {
  await prisma.note.deleteMany({
    where: { deals: { hasSome: dealIds } },
  });
}
