import Comparator from "../../types/Comparator";

class DateComparator implements Comparator {
  public compare(selfValue: Date, otherValue: Date): number {
    return selfValue.getTime() > otherValue.getTime()
      ? 1
      : selfValue.getTime() === otherValue.getTime()
        ? 0
        : -1;
  }
}

export default DateComparator;