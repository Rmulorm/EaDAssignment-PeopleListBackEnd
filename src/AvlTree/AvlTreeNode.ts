import Comparator from "../types/Comparator";

class AvlTreeNode<ValueType> {
  private value: ValueType;
  private indexes: number[];

  private treeHeight: number;
  private balanceFactor: number;

  private leftChildren: AvlTreeNode<ValueType> | null;
  private rightChildren: AvlTreeNode<ValueType> | null;

  private comparator: Comparator;

  public constructor(value: ValueType, index: number, comparator: Comparator) {
    this.value = value;
    this.indexes = new Array<number>();
    this.indexes.push(index);

    this.treeHeight = 1;
    this.balanceFactor = 0;

    this.leftChildren = null;
    this.rightChildren = null;

    this.comparator = comparator;
  }

  public getValue(): ValueType {
    return this.value;
  }

  public getTreeHeight(): number {
    return this.treeHeight;
  }

  public getBalanceFactor(): number {
    return this.balanceFactor;
  }

  public getIndexes(): number[] {
    const returnIndexes = new Array<number>();

    returnIndexes.push(...this.indexes);
    if (this.leftChildren)
      returnIndexes.push(...this.leftChildren.getIndexes());
    if (this.rightChildren)
      returnIndexes.push(...this.rightChildren.getIndexes());

    return returnIndexes;
  }

  public insert(value: ValueType, index: number): AvlTreeNode<ValueType> {
    const comparisonResult = this.comparator.compare(this.value, value);

    if (comparisonResult === 0) {
      if (this.indexes.includes(index)) {
        throw new Error("This value is already in the Tree");
      } else {
        this.indexes.push(index);
      }
    } else if (comparisonResult > 0) {
      this.leftChildren = this.insertToTheLeft(value, index);
    } else {
      this.rightChildren = this.insertToTheRight(value, index);
    }

    this.updateTreeHeight();
    this.updateBalanceFactor();

    return this.balanceTree();
  }

  private insertToTheLeft(value: ValueType, index: number): AvlTreeNode<ValueType> {
    if (this.leftChildren === null)
      return new AvlTreeNode<ValueType>(value, index, this.comparator);
    else
      return this.leftChildren.insert(value, index);
  }

  private insertToTheRight(value: ValueType, index: number): AvlTreeNode<ValueType> {
    if (this.rightChildren === null)
      return new AvlTreeNode<ValueType>(value, index, this.comparator);
    else
      return this.rightChildren.insert(value, index);
  }

  private balanceTree(): AvlTreeNode<ValueType> {
    if (this.balanceFactor > 1)
      return this.rotateToTheRight()
    else if (this.balanceFactor < -1)
      return this.rotateToTheLeft()

    return this;
  }

  public rotateToTheRight(): AvlTreeNode<ValueType> {
    if (!this.leftChildren)
      throw new Error("Invalid rotation to the Right: There's no left children");

    if (this.leftChildren.getBalanceFactor() < 0)
      this.leftChildren = this.leftChildren.rotateToTheLeft();

    return this.leftChildren.updateRightChildren(this);
  }

  public updateRightChildren(node: AvlTreeNode<ValueType> | null): AvlTreeNode<ValueType> {
    node?.setLeftChildren(this.rightChildren);
    this.setRightChildren(node);

    return this;
  }

  private rotateToTheLeft(): AvlTreeNode<ValueType> {
    if (!this.rightChildren)
      throw new Error("Invalid rotation to the Right: There's no left children");

    if (this.rightChildren.getBalanceFactor() > 0)
      this.rightChildren = this.rightChildren.rotateToTheRight();

    return this.rightChildren.updateLeftChildren(this);
  }

  public updateLeftChildren(node: AvlTreeNode<ValueType> | null): AvlTreeNode<ValueType> {
    node?.setRightChildren(this.leftChildren);
    this.setLeftChildren(node);

    return this;
  }

  public setRightChildren(node: AvlTreeNode<ValueType> | null) {
    this.rightChildren = node;

    this.updateTreeHeight();
    this.updateBalanceFactor();
  }

  public setLeftChildren(node: AvlTreeNode<ValueType> | null) {
    this.leftChildren = node;

    this.updateTreeHeight();
    this.updateBalanceFactor();
  }

  private updateTreeHeight() {
    const leftTreeHeight = this.getChildrenTreeHeight(this.leftChildren);
    const rightTreeHeight = this.getChildrenTreeHeight(this.rightChildren);

    this.treeHeight = Math.max(leftTreeHeight, rightTreeHeight) + 1;
  }

  private updateBalanceFactor() {
    const leftTreeHeight = this.getChildrenTreeHeight(this.leftChildren);
    const rightTreeHeight = this.getChildrenTreeHeight(this.rightChildren);

    this.balanceFactor = leftTreeHeight - rightTreeHeight;
  }

  private getChildrenTreeHeight(children: AvlTreeNode<ValueType> | null) {
    if (children)
      return children.getTreeHeight();

    return 0;
  }

  public remove(value: ValueType): AvlTreeNode<ValueType> | null {
    const comparisonResult = this.comparator.compare(this.value, value);
    if (comparisonResult > 0 && this.leftChildren) {
      this.setLeftChildren(this.leftChildren.remove(value));
      return this.balanceTree();
    } else if (comparisonResult < 0 && this.rightChildren) {
      this.setRightChildren(this.rightChildren.remove(value));
      return this.balanceTree();
    } else if (comparisonResult === 0)
      return this.removeMyself();

    throw new Error('Value is not in the Tree');
  }

  private removeMyself(): AvlTreeNode<ValueType> | null {
    if (this.leftChildren && this.rightChildren)
      return this.leftChildren.insertNode(this.rightChildren)
    else if (this.leftChildren)
      return this.leftChildren;
    else if (this.rightChildren)
      return this.rightChildren;
    else
      return null;
  }

  public insertNode(node: AvlTreeNode<ValueType>): AvlTreeNode<ValueType> {
    if (this.comparator.compare(node.getValue(), this.value) < 0) {
      this.leftChildren = this.insertNodeToTheLeft(node);
    } else {
      this.rightChildren = this.insertNodeToTheRight(node);
    }

    this.updateTreeHeight();
    this.updateBalanceFactor();

    return this.balanceTree();
  }

  private insertNodeToTheLeft(node: AvlTreeNode<ValueType>): AvlTreeNode<ValueType> {
    if (this.leftChildren === null)
      return node;
    else
      return this.leftChildren.insertNode(node);
  }

  private insertNodeToTheRight(node: AvlTreeNode<ValueType>): AvlTreeNode<ValueType> {
    if (this.rightChildren === null)
      return node;
    else
      return this.rightChildren.insertNode(node);
  }

  public find(value: ValueType): number[] | null {
    const comparisonResult = this.comparator.compare(this.value, value);

    if (comparisonResult === 0)
      return this.indexes;
    else if (comparisonResult > 0 && this.leftChildren)
      return this.leftChildren.find(value);
    else if (comparisonResult < 0 && this.rightChildren)
      return this.rightChildren.find(value);
    else
      return null;
  }

  public findStartingWith(value: string): number[] | null {
    const selectedValues = new Array<number>();

    return this.searchStartingWith(selectedValues, value);
  }

  private searchStartingWith(selectedValues: number[], value: string): number[] | null {
    const comparisonResult = this.comparator.compare(new String(this.value).substring(0, value.length), value);

    if (comparisonResult > 0 && this.leftChildren) {
      this.leftChildren.searchStartingWith(selectedValues, value);
    }

    if (comparisonResult == 0) {
      selectedValues.push(...this.indexes);
      if (this.leftChildren) {
        this.leftChildren.searchStartingWith(selectedValues, value);
      }
      if (this.rightChildren) {
        this.rightChildren.searchStartingWith(selectedValues, value);
      }
    }

    if (comparisonResult < 0 && this.rightChildren) {
      this.rightChildren.searchStartingWith(selectedValues, value);
    }

    return selectedValues;
  }

  public findRange(beginValue: ValueType, endValue: ValueType): number[] | null {
    const selectedValues = new Array<number>();

    return this.searchRange(selectedValues, beginValue, endValue);
  }

  public searchRange(selectedValues: number[], beginValue: ValueType, endValue: ValueType): number[] | null {
    const beginComparisonResult = this.comparator.compare(this.value, beginValue);
    const endComparisonResult = this.comparator.compare(this.value, endValue);

    if (beginComparisonResult > 0 && this.leftChildren) {
      this.leftChildren.searchRange(selectedValues, beginValue, endValue);
    }

    if (beginComparisonResult >= 0 && endComparisonResult <= 0) {
      selectedValues.push(...this.indexes);
    }

    if (endComparisonResult < 0 && this.rightChildren) {
      this.rightChildren.searchRange(selectedValues, beginValue, endValue);
    }

    return selectedValues;
  }
};

export default AvlTreeNode;