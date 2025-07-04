export function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "One of the files is too large." });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(413).json({ error: "Too many files uploaded." });
    }

    return res.status(400).json({ error: err.message });
  }

  next(err);
}
