import Comparator from "../../types/Comparator";

class StringComparator implements Comparator {
  public compare(selfValue: string, otherValue: string): number {
    return selfValue.localeCompare(otherValue);
  }
}

export default StringComparator;