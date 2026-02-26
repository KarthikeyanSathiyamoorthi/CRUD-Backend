import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

const AppError = require("../utils/AppError");
const asyncHandler = require("../middleware/asyncHandler");
const Avatar = require("../models/Avatar");
const fs = require("fs");

interface UploadAvatarPhotoRequest extends Request {
  file: Express.Multer.File;
  body: {
    userId: string;
  };
}
interface IAvatar extends Document {
  userId: string;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
}

const uploadAvatarPhoto = asyncHandler(
  async (req: UploadAvatarPhotoRequest, res: Response) => {
    // Find the avatar first
    const avatar = await Avatar.findOne({ userId: req.body.userId });
    if (avatar) {
      deleteOldFilePath(avatar);

      avatar.filename = req.file.filename;
      avatar.filepath = req.file.path;
      avatar.mimetype = req.file.mimetype;
      avatar.size = req.file.size;
      avatar.uploadedAt = new Date();

      const updatedAvatar = await avatar.save();
      return res.status(201).json({
        success: true,
        message: "Avatar updated successfully",
        data: updatedAvatar,
      });
    }

    // Save file metadata to database
    const photoData = {
      userId: req.body.userId, // from form data
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    // save to Database
    const savedAvatar = await Avatar.create(photoData);

    res.status(201).json({
      success: true,
      message: "Avatar saved successfully",
      data: savedAvatar,
    });
  },
);

const getAvatarPhoto = asyncHandler(async (req: Request, res: Response) => {
  // Get photo info from database
  const avatar = await Avatar.findOne({ userId: req.params.id });
  if (!avatar) {
    return res.status(404).json({
      success: false,
      photoUrl: `Avatar not found`,
    });
  }

  res.status(200).json({
    success: true,
    photoUrl: `/uploads/${avatar.filename}`,
  });
});

const deleteAvatarPhoto = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Find the avatar first
    const avatar = await Avatar.findOne({ userId: req.params.id });
    // if Todo not found
    if (!avatar) {
      return next(new AppError("Avatar not found", 404));
    }

    deleteOldFilePath(avatar);

    await avatar.deleteOne();

    // success response
    res.status(200).json({
      success: true,
      message: "Avatar deleted successfully",
    });
  },
);

// Delete the old file from disk before updating
const deleteOldFilePath = (avatar: IAvatar) => {
  const oldFilePath = avatar.filepath;
  if (oldFilePath && fs.existsSync(oldFilePath)) {
    fs.unlinkSync(oldFilePath);
  }
};

module.exports = { uploadAvatarPhoto, getAvatarPhoto, deleteAvatarPhoto };
export {};
