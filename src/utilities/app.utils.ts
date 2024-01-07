export class AppUtils {
  static hasNMinutesPassed(n: number, originalDate: Date): boolean {
    // Get the current time
    const currentTime = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = currentTime.getTime() - originalDate.getTime();

    // Convert the difference to minutes
    const minutesDifference = timeDifference / (1000 * 60);

    // Check if 5 minutes have passed
    return minutesDifference >= n;
  }

  static getTimeDifferenceInMinutes(startDate: Date, endDate: Date): number {
    const timeDifferenceInMilliseconds =
      endDate.getTime() - startDate.getTime();
    const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);
    return timeDifferenceInMinutes;
  }
}
