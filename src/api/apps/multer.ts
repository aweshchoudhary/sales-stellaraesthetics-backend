import multer from "multer";
import path from "path";

const multerStorage = multer.diskStorage({
  destination: (req: any, file: any, cb: CallableFunction) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req: any, file: any, cb: CallableFunction) => {
    const extArr = file.originalname.split(".");
    const ext = extArr[extArr.length - 1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const uploadFile = multer({
  storage: multerStorage,
});

export default uploadFile;
