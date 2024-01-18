import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPipelineById(pipelineId: string) {
  const pipeline = await prisma.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  });

  return pipeline;
}

export async function isPipelineExistWithId(pipelineId: string) {
  const pipeline = await prisma.pipeline.count({
    where: {
      id: pipelineId,
    },
  });
  if (pipeline === 0) {
    return false;
  }
  return true;
}

// export async function changePipelineOwnerWithId(pipelineId: string) {
//   await prisma.pipeline.update({
//       where: {
//         id: req.params.pipelineId,
//       },
//       data: {
//         owner: {
//           connect: {
//             id: ,
//           },
//         },
//       },
//     });
//   if (pipeline === 0) {
//     return false;
//   }
//   return true;
// }
