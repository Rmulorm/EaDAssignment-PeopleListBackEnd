import Comparator from "./Comparator";

class NumberComparator implements Comparator{
    public compare(selfValue: number, otherValue: number): number {
        return selfValue > otherValue 
            ? 1 
            : selfValue == otherValue 
                ? 0 
                : -1;
    }
}

export default NumberComparator;