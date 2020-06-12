import Comparator from "../../types/Comparator";

class DateComparator implements Comparator {
  public compare(selfValue: Date, otherValue: Date): number {
    return selfValue > otherValue
      ? 1
      : selfValue === otherValue
        ? 0
        : -1;
  }
}

export default DateComparator;