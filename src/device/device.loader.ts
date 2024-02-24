import * as fs from 'fs';
const CsvParser = require('csv-parser');
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as process from 'process';

export class DeviceLoader {
  private static deviceHashMap = new Map<string, object>();

  static init() {
    const deviceListPath = path.join(
      process.cwd(),
      process.env.NODE_ENV == 'development' ? 'src' : '',
      'static',
      'supported_devices.csv',
    );
    fs.createReadStream(deviceListPath, { encoding: 'utf16le' })
      .pipe(CsvParser())
      .on('data', (data) => {
        DeviceLoader.set(data.model.toLowerCase().trim(), data);
      })
      .on('end', () => {
        Logger.log(`Device Load Successfully From ${deviceListPath}`, 'Main');
      });
  }

  static set(key, value) {
    this.deviceHashMap.set(key.trim(), value);
  }

  static getDeviceMarketingNameByModel(model: string): string {
    const obj = this.deviceHashMap.get(model?.toLowerCase().trim());
    return obj ? obj['name'] : 'unknown';
  }

  static getDeviceBrandByModel(model: string): string {
    const obj = this.deviceHashMap.get(model?.toLowerCase().trim());
    return obj ? obj['﻿branding'] : 'unknown';
  }
}
