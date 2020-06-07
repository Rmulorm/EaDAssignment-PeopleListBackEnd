import AvlTreeNode from "./AvlTreeNode"
import Comparator from "../types/Comparator";

class Tree<ValueType> {
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

  public delete(value: ValueType) {
    return(new Promise((resolve, reject) => {
      if (!this.root) {
        reject(new Error("Empty Tree"));
        return;
      }
      try {
        this.root = this.root.remove(value);
      } catch(error) {
        reject(error);
        return;
      }

      resolve();
    }));
  }
};

export default Tree;