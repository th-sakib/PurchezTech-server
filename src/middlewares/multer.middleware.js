import multer from "multer";

const storage = new multer.memoryStorage();

export const upload = multer({
  storage,
  // limits: 5 * 1024 * 1024,
  // fileFilter: (req, file, cb) => {
  //   const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  //   if (!allowedTypes.includes(file.mimetype)) {
  //     return cb("Only jpg jpeg and png file types are allowed", false);
  //   }
  //   cb(null, true);
  // },
});
