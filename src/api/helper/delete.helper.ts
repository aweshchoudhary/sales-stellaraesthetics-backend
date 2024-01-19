import { PrismaClient } from "@prisma/client";
import { unlink } from "fs";
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
    deleteFiles(dealIDsArr),
    deleteActivities(dealIDsArr),
    deleteNotes(dealIDsArr),
  ];

  await Promise.all(deleteTasks);
  await prisma.deal.deleteMany({ where: { currentStageId: stageId } });
}

export async function deleteFiles(dealIds: string[]) {
  const files = await prisma.file.findMany({
    where: { dealId: { in: dealIds } },
  });
  files.forEach(async (file) => {
    unlink("public/uploads/" + file.name, async () => {
      await prisma.file.delete({
        where: {
          id: file.id,
        },
      });
    });
  });
}

export async function deleteActivities(dealIds: string[]) {
  await prisma.activity.deleteMany({
    where: { dealId: { in: dealIds } },
  });
}
export async function deleteNotes(dealIds: string[]) {
  await prisma.note.deleteMany({
    where: { dealId: { in: dealIds } },
  });
}
