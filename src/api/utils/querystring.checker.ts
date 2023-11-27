import { Request } from "express";

function queryStringCheck(req: Request) {
  const { filters, sort, limit, populate, select, start }: any = req.query;
  const config: any = {};

  if (sort) {
    const sortArr: any = JSON.parse(sort);
    sortArr.forEach((item: { id: string; desc: boolean }) => {
      config.orderBy = {
        ...config.orderBy,
        [item.id]: item.desc ? "desc" : "asc",
      };
    });
  }

  if (filters) {
    const filtersArr: any = JSON.parse(filters);
    if (filters.length) {
      filtersArr.forEach((item: any) => {
        config.where = {
          ...config.where,
          [item.id]: item.value,
        };
      });
    }
  }

  if (limit) config.take = Number(limit);
  if (start) config.skip = Number(start);
  if (populate) config.include = JSON.parse(populate);
  // if (select) config.select = select;

  return config;
}

export default queryStringCheck;
