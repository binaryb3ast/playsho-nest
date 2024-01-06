import * as Crypto from 'crypto';
import { KeyPairKeyObjectResult } from 'crypto';

export default class AppCryptography {
  static IV_LENGTH = 16;

  static ALGORITHM_AES_256_CBC = 'aes-256-cbc';
  static ALGORITHM_AES_128_CBC = 'aes-128-cbc';
  // static ALGORITHM_AES_128_CBC = "aes-128-cbc-hmac-sha256";

  static DIGEST_SHA512 = 'sha512';
  static DIGEST_SHA256 = 'sha256';

  static KEY_LEN_AES_128_CBC = 16;
  static KEY_LEN_AES_256_CBC = 32;

  static async createRsaKeys(): Promise<KeyPairKeyObjectResult> {
    return Crypto.generateKeyPairSync('rsa', {
      // The standard secure default length for RSA keys is 2048 bits
      publicExponent: 0x10101,
      modulusLength: 2048,
    });
  }

  static generateUUID(): string {
    const buf = Crypto.randomBytes(16);
    buf[6] = (buf[6] & 0x0f) | 0x40; // Set version to 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // Set variant to RFC4122
    return buf
      .toString('hex')
      .match(/(.{8})(.{4})(.{4})(.{4})(.{12})/)
      .slice(1)
      .join('-');
  }

  static encryptWithPublicKey(publicKey: string, data): Buffer {
    return Crypto.publicEncrypt(
      {
        key: publicKey,
        oaepHash: this.DIGEST_SHA256,
      },
      Buffer.from(data),
    );
  }

  static decryptWithPrivateKey(privateKey: string, encryptedData): Buffer {
    return Crypto.privateDecrypt(
      {
        key: privateKey,
        oaepHash: this.DIGEST_SHA256,
      },
      encryptedData,
    );
  }

  static createHmac(algorithm: string, secret: string, data: string): string {
    return Crypto.createHmac(algorithm, secret).update(data).digest('hex');
  }

  static async pbkdf2(
    pass: string,
    salt: string,
    iteration: number,
    keyLen: number,
    digest: string,
  ): Promise<string> {
    console.log({
      pass,
      salt,
      iteration,
      keyLen,
      digest,
    });
    return Crypto.pbkdf2Sync(pass, salt, iteration, keyLen, digest).toString(
      'hex',
    );
  }

  static generateNanoID(length: number): string {
    const charSource =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const bytes = Crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      const index = bytes[i] % charSource.length;
      result += charSource.charAt(index);
    }
    return result;
  }

  static generateRandomNumber(n: number): string {
    const bytesNeeded = Math.ceil(n * 0.5);
    const randomByte = Crypto.randomBytes(bytesNeeded);
    const hexString = randomByte.toString('hex');
    const randomNumber = parseInt(hexString, 16);
    const digits = randomNumber.toString().split('');
    return digits.slice(0, n).join('');
  }

  static createSalt(byteLength: number): string {
    return Crypto.randomBytes(byteLength).toString('hex');
  }

  static generateRandomHash = () => {
    const hash = Crypto.createHash(this.DIGEST_SHA512);
    hash.update(this.generateRandomByte(64));
    return hash.digest('hex');
  };

  static generateRandomByte = (size) => {
    return Crypto.randomBytes(size).toString('hex');
  };

  static generateHexPBKDF2 = (pass, slat, integration, keyLen, digest) => {
    return Crypto.pbkdf2Sync(pass, slat, integration, keyLen, digest).toString(
      'hex',
    );
  };

  static createHmacSha256 = (key, data, encoding) => {
    return Crypto.createHmac('sha256', key).update(data).digest(encoding);
  };

  static generateInitializationVector = () => {
    return Crypto.randomBytes(this.IV_LENGTH);
  };

  static encryptAES = (encryptionType, data, key) => {
    const iv = this.generateInitializationVector();
    const cipher = Crypto.createCipheriv(
      encryptionType,
      Buffer.from(key, 'hex'),
      iv,
    );
    const bufferData = Buffer.from(data.toString());
    let encrypted = cipher.update(bufferData);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  };

  static decryptAES = (encryptionType, data, key) => {
    const ivBuffer = Buffer.from(this.getIVDataPart(data), 'hex');
    const keyBuffer = Buffer.from(key, 'hex');
    const decipher = Crypto.createDecipheriv(
      encryptionType,
      keyBuffer,
      ivBuffer,
    );
    let decrypted = decipher.update(
      this.getEncryptedDataPart(data),
      'hex',
      'utf8',
    );
    decrypted += decipher.final('utf8');
    return decrypted.toString();
  };

  static getDataPart = (data) => {
    return data.split(':');
  };

  static getEncryptedDataPart = (data) => {
    return this.getDataPart(data)[1];
  };

  static getIVDataPart = (data) => {
    return this.getDataPart(data)[0];
  };
}
