import * as fs from 'fs';
import Validator from '../app.validator';
import * as path from 'path';
import * as process from 'process';

const Translate = (key: string, ...arg): string => {
  const filePath = path.join(
    process.cwd(),
    'src',
    'utilities',
    'locale',
    'common.json',
  );
  const commonFile = fs.readFileSync(filePath, 'utf8');
  const commonObj = JSON.parse(commonFile);
  let string = commonObj[key];
  if (Validator.isNull(string)) {
    return '';
  }
  if (arg.length > 0) {
    arg.forEach((val) => {
      string = string.replace('$arg', val);
    });
  }
  return string;
};

export default Translate;
