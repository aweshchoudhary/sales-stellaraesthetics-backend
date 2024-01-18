import { UserBaseInterface } from "../user/user.util";
import { BaseModel } from "../../common/interfaces";

export interface APIKeyBaseInterface {
  name?: string;
  desc?: string;
  key: string;
  userId: string | (UserBaseInterface & BaseModel);
  status: string;
  createdById?: string;
}
