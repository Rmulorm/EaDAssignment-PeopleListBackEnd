import AvlTreeNode from "./AvlTreeNode"
import Comparator from "../types/Comparator";

class AvlTree<ValueType> {
  private root: AvlTreeNode<ValueType> | null;
  private comparator: Comparator;

  public constructor(comparator: Comparator) {
    this.root = null;
    this.comparator = comparator;
  }

  public add(value: ValueType, index: number) {
    if (!this.root)
      this.root = new AvlTreeNode(value, index, this.comparator);
    else
      this.root = this.root.insert(value, index);
  }

  public getAll(): number[] {
    if (!this.root)
      throw new Error ("Tree is empty");

    return this.root.getIndexes();
  }

  public find(value: ValueType): number[] | null {
    if (!this.root)
      throw new Error ("Tree is empty");

    return this.root.find(value);
  }
};

export default AvlTree;