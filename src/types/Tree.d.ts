export default interface Tree<ValueType> {
  value: ValueType;
  indexes: number[];
  leftChildren?: Tree<ValueType>;
  rightChildren?: Tree<ValueType>;
}