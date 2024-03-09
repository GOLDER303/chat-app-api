import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { existsSync, mkdirSync } from 'fs';
import * as mime from 'mime-types';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export const multerOptions: MulterOptions = {
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error, acceptFile: boolean) => void,
  ) {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Invalid file type'), false);
    }
  },

  storage: diskStorage({
    destination(req, file, callback) {
      const uploadPath = './uploads';

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },

    filename(req, file, callback) {
      const fileExtension = mime.extension(file.mimetype);
      callback(null, `${uuid()}.${fileExtension}`);
    },
  }),
};
