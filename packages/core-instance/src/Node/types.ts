import type {
  RectDimensions,
  IPointNum,
  IPointAxes,
  Direction,
  Axes,
  Axis,
} from "@dflex/utils";

export interface AbstractOpts {
  isInitialized: boolean;
  isPaused: boolean;
}

export type AbstractInput = {
  id: string;
  ref?: HTMLElement;
};

export type AllowedDataset =
  | "gridX"
  | "gridY"
  | "index"
  | "draggedOutPosition"
  | "draggedOutContainer";

export type AllowedAttributes = "dragged";

export type AttributesIndicators =
  | Exclude<AllowedDataset, "index">
  | AllowedAttributes;

export interface IAbstract {
  readonly isInitialized: boolean;
  isPaused: boolean;
  readonly ref: HTMLElement | null;
  readonly id: string;
  readonly translate: IPointNum;
  attach(ref: HTMLElement | null): void;
  detach(): void;
  initTranslate(): void;
  transform(x: number, y: number): void;
  setDataset(key: AllowedDataset, value: number | boolean): void;
  rmDateset(key: Exclude<AllowedDataset, "index">): void;
  setAttribute(key: AllowedAttributes, value: string): void;
  removeAttribute(key: AllowedAttributes): void;
  clearAttributes(): void;
}

/**
 * Element unique keys in DOM tree.
 */
export interface Keys {
  SK: string;
  PK: string;
  CHK: string | null;
}

/**
 * Element order in its branch & higher branch
 */
export interface Order {
  self: number;
  parent: number;
}

/**
 * Generated element pointer
 */
export interface Pointer {
  keys: Keys;
  order: Order;
}

export interface INodeInput extends AbstractInput {
  order: Order;
  keys: Keys;
  depth: number;
  scrollX: number;
  scrollY: number;
}

export type ITransitionHistory = {
  ID: string;
  axis: Axes;
  translate: IPointAxes;
};

export interface ICore extends IAbstract {
  /** Initial read-only element offset */
  readonly offset: RectDimensions;

  /** Current element offset (x-left, y-top) */
  readonly currentPosition: IPointNum;

  /** Element position in the grid container. */
  grid: IPointNum;

  /** Element visibility in the scroll container. */
  isVisible: boolean;

  /** Animated frame if the element is transforming  */
  readonly animatedFrame: number | null;

  readonly order: Order;
  readonly keys: Keys;
  readonly depth: number;

  resume(scrollX: number, scrollY: number): void;
  changeVisibility(isVisible: boolean): void;
  setPosition(
    iDsInOrder: string[],
    direction: Direction,
    elmSpace: IPointNum,
    operationID: string,
    siblingsEmptyElmIndex: number,
    axis: Axes
  ): number;
  transformElm(): void;
  /** Direct element assignment. Handle the case for settling the draggable element */
  assignNewPosition(branchIDsOrder: string[], newIndex: number): void;
  rollBack(operationID: string, isForceTransform: boolean): void;
}

export interface INode extends ICore {
  isConnected(): boolean;
  isPositionedUnder(elmY: number): boolean;
  isPositionedLeft(elmX: number): boolean;
  getRectBottom(): number;
  getRectRight(): number;
  getOffset(): RectDimensions;
  hasSamePosition(elm: this, axis: Axis): boolean;
}
