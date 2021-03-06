import { FileError, FileRejection } from 'react-dropzone';

import { isNotNil } from '../../utils/type-guards';

import { formatFileSize } from './formatFileSize';

const ERROR_FORMATTERS: Record<FileError['code'], (file: File) => string> = {
  'file-invalid-type': ({ type }) =>
    ['формат файла не подходит', type && `(${type})`].filter(isNotNil).join(' '),
  'file-too-large': ({ size }) => `файл слишком большой (максимум ${formatFileSize(size)})`,
  'file-too-small': ({ size }) => `файл слишком маленький (минимум ${formatFileSize(size)})`,
};

const GENERAL_ERROR = 'не получилось добавить файл';

export const getErrorsList = (fileRejections: FileRejection[]): string[] => {
  const errorsList: string[] = [];
  let tooManyFilesErrorsCount = 0;

  for (const rejection of fileRejections) {
    for (const error of rejection.errors) {
      if (error.code === 'too-many-files') {
        tooManyFilesErrorsCount++;
      } else {
        errorsList.push(
          `${rejection.file.name}: ${ERROR_FORMATTERS[error.code]?.(rejection.file) ??
            GENERAL_ERROR}`,
        );
      }
    }
  }

  if (tooManyFilesErrorsCount) {
    errorsList.unshift(`Вы перетащили несколько файлов. Выберите один, пожалуйста`);
  }

  return errorsList;
};
