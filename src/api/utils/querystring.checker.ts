import { Request } from "express";
import { getManyReqFilters } from "../common/utils";

function queryStringCheck(req: Request) {
  const { sort, skip, limit, include } = getManyReqFilters.parse(req.query);
  const config: any = {};

  if (sort) {
    let sortJSON: any = sort;
    const sortArr: any = JSON.parse(sortJSON);
    sortArr.forEach((item: { id: string; desc: boolean }) => {
      config.orderBy = {
        ...config.orderBy,
        [item.id]: item.desc ? "desc" : "asc",
      };
    });
  }

  if (limit) config.take = Number(limit) ?? 10;
  if (skip) config.skip = Number(skip) ?? 0;

  if (include) {
    let configIncludes = {};
    const fields: string[] = include.split(",");

    fields.map((field: string) => {
      configIncludes = {
        ...configIncludes,
        [field]: true,
      };
    });

    config.include = configIncludes;
  }

  return config;
}

export default queryStringCheck;
