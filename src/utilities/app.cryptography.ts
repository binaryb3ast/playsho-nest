import * as Crypto from "crypto";
import { KeyPairKeyObjectResult } from "crypto";

export default class AppCryptography {
  static IV_LENGTH = 16;

  static ALGORITHM_AES_256_CBC = "aes-256-cbc";
  static ALGORITHM_AES_128_CBC = "aes-128-cbc";
  // static ALGORITHM_AES_128_CBC = "aes-128-cbc-hmac-sha256";

  static DIGEST_SHA512 = "sha512";
  static DIGEST_SHA256 = "sha256";

  static KEY_LEN_AES_128_CBC = 16;
  static KEY_LEN_AES_256_CBC = 32;

  static async createRsaKeys(): Promise<KeyPairKeyObjectResult> {
    return Crypto.generateKeyPairSync("rsa", {
      // The standard secure default length for RSA keys is 2048 bits
      publicExponent: 0x10101,
      modulusLength: 2048
    });
  }

  static generateUUID(): string {
    const buf = Crypto.randomBytes(16);
    buf[6] = (buf[6] & 0x0f) | 0x40; // Set version to 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // Set variant to RFC4122
    return buf
      .toString("hex")
      .match(/(.{8})(.{4})(.{4})(.{4})(.{12})/)
      .slice(1)
      .join("-");
  }

  static createHmac(algorithm: string, secret: string, data: string): string {
    return Crypto.createHmac(algorithm, secret).update(data).digest("hex");
  }

  static async pbkdf2(
    pass: string,
    salt: string,
    iteration: number,
    keyLen: number,
    digest: string
  ): Promise<string> {
    return Crypto.pbkdf2Sync(pass, salt, iteration, keyLen, digest).toString(
      "hex"
    );
  }

  static generateNanoID(length: number): string {
    const charSource =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const bytes = Crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      const index = bytes[i] % charSource.length;
      result += charSource.charAt(index);
    }
    return result;
  }

  static generateSecureRandomNumber(length: number): string {
    const bytes = Math.ceil(length / 2);
    const randomBuffer = Crypto.randomBytes(bytes);
    const randomNumber = BigInt(`0x${randomBuffer.toString("hex")}`);
    let result = randomNumber.toString();
    if (result.length > length) {
      result = result.slice(0, length);
    } else {
      result = result.padStart(length, "0");
    }
    return result;
  }

  static generateSecureNumber(min: number, max: number): number {
    return Crypto.randomInt(min, max);
  }

  static generateRandomNumber(length: number): number {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static createSalt(byteLength: number): string {
    return Crypto.randomBytes(byteLength).toString("hex");
  }

  static generateRandomHash = () => {
    const hash = Crypto.createHash(this.DIGEST_SHA512);
    hash.update(this.generateRandomByte(64));
    return hash.digest("hex");
  };

  static generateRandomByte = (size) => {
    return Crypto.randomBytes(size).toString("hex");
  };

  static encryptWithPublicKey(key, data): string {
    const encryptedData = Crypto.publicEncrypt({
      key: this.stringToPublicKey(key),
      padding: Crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(data));
    return encryptedData.toString("base64");
  }

  static stringToPublicKey(publicKeyStr) {
    return  Crypto.createPublicKey(publicKeyStr);
  }

  static generateHexPBKDF2 = (pass, slat, integration, keyLen, digest) => {
    return Crypto.pbkdf2Sync(pass, slat, integration, keyLen, digest).toString(
      "hex"
    );
  };

  static createHmacSha256 = (key, data, encoding) => {
    return Crypto.createHmac("sha256", key).update(data).digest(encoding);
  };

  static createHash(data: string = AppCryptography.generateUUID()): string {
    return Crypto.createHash("sha256").update(data).digest("hex");
  }

  static generateInitializationVector = () => {
    return Crypto.randomBytes(this.IV_LENGTH);
  };

  static encryptAES = (encryptionType, data, key) => {
    const iv = this.generateInitializationVector();
    const cipher = Crypto.createCipheriv(
      encryptionType,
      Buffer.from(key, "hex"),
      iv
    );
    const bufferData = Buffer.from(data.toString());
    let encrypted = cipher.update(bufferData);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  };

  static decryptAES = (encryptionType, data, key) => {
    const ivBuffer = Buffer.from(this.getIVDataPart(data), "hex");
    const keyBuffer = Buffer.from(key, "hex");
    const decipher = Crypto.createDecipheriv(
      encryptionType,
      keyBuffer,
      ivBuffer
    );
    let decrypted = decipher.update(
      this.getEncryptedDataPart(data),
      "hex",
      "utf8"
    );
    decrypted += decipher.final("utf8");
    return decrypted.toString();
  };

  static getDataPart = (data) => {
    return data.split(":");
  };

  static getEncryptedDataPart = (data) => {
    return this.getDataPart(data)[1];
  };

  static getIVDataPart = (data) => {
    return this.getDataPart(data)[0];
  };
}
