// BadNameFilterModule.ts
import { Global, Injectable } from "@nestjs/common";

@Injectable()
export class AppNameSanitizer {
  private readonly badNames: Set<string>;

  constructor() {
    // Initialize the set of bad names
    this.badNames = new Set([
      'fuck',
      'hitler',
    ]);
  }

  hasForbiddenTerm(name: string): boolean {
    const lowerCaseName = name.toLowerCase();
    for (const bannedWord of this.badNames) {
      if (lowerCaseName.includes(bannedWord)) {
        return true;
      }
    }
    return false;
  }
}
