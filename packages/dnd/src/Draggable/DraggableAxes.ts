import { AbstractDraggable } from "@dflex/draggable";

import { Threshold, PointNum, PointBool, Migration } from "@dflex/utils";
import type {
  ThresholdInterface,
  IPointNum,
  IPointBool,
  IMigration,
  IPointAxes,
} from "@dflex/utils";

import type { INode } from "@dflex/core-instance";

import store from "../DnDStore";

import type { IDraggableAxes, Restrictions } from "./types";

import type { FinalDndOpts, RestrictionsStatus } from "../types";

class DraggableAxes extends AbstractDraggable<INode> implements IDraggableAxes {
  positionPlaceholder: IPointNum;

  gridPlaceholder: IPointNum;

  migration: IMigration;

  threshold: ThresholdInterface;

  readonly enableContainersTransition: boolean;

  isViewportRestricted: boolean;

  isMovingAwayFrom: IPointBool;

  readonly innerOffset: IPointNum;

  #isLayoutStateUpdated: boolean;

  readonly #axesFilterNeeded: boolean;

  readonly #restrictions: Restrictions;

  readonly #restrictionsStatus: RestrictionsStatus;

  readonly #marginX: number;

  readonly #initCoordinates: IPointNum;

  constructor(id: string, initCoordinates: IPointAxes, opts: FinalDndOpts) {
    const { element } = store.getElmTreeById(id);

    super(element, initCoordinates);

    this.#isLayoutStateUpdated = false;

    const {
      order,
      grid,
      currentPosition,
      keys: { SK },
      offset: { width, height },
      depth,
    } = element;

    this.gridPlaceholder = new PointNum(grid.x, grid.y);

    const siblings = store.getElmBranchByKey(SK);

    const lastElmId = siblings[siblings.length - 1];

    this.migration = new Migration(
      order.self,
      SK,
      store.registry[lastElmId].currentPosition
    );

    this.isViewportRestricted = true;

    this.enableContainersTransition = opts.enableContainersTransition;

    this.threshold = new Threshold(opts.threshold);

    this.threshold.setMainThreshold(id, {
      width,
      height,
      left: currentPosition.x,
      top: currentPosition.y,
    });

    store.getBranchesByDepth(depth).forEach((key) => {
      const { boundaries } = store.containers[key];

      if (process.env.NODE_ENV !== "production") {
        if (!boundaries) {
          throw new Error(`Siblings boundaries for ${key} not found.`);
        }
      }

      this.threshold.setContainerThreshold(key, boundaries);
    });

    this.isMovingAwayFrom = new PointBool(false, false);

    const { x, y } = initCoordinates;

    this.#initCoordinates = new PointNum(x, y);

    this.innerOffset = new PointNum(
      Math.round(x - currentPosition.x),
      Math.round(y - currentPosition.y)
    );

    const style = window.getComputedStyle(this.draggedElm.ref!);

    // get element margin
    const rm = Math.round(parseFloat(style.marginRight));
    const lm = Math.round(parseFloat(style.marginLeft));
    this.#marginX = rm + lm;

    this.positionPlaceholder = new PointNum(
      currentPosition.x,
      currentPosition.y
    );

    this.#restrictions = opts.restrictions;

    this.#restrictionsStatus = opts.restrictionsStatus;

    this.#axesFilterNeeded =
      siblings !== null &&
      (opts.restrictionsStatus.isContainerRestricted ||
        opts.restrictionsStatus.isSelfRestricted);
  }

  private axesYFilter(
    y: number,
    topThreshold: number,
    bottomThreshold: number,
    allowTop: boolean,
    allowBottom: boolean,
    isRestrictedToThreshold: boolean // if not. Then to self.
  ) {
    const currentTop = y - this.innerOffset.y;
    const currentBottom = currentTop + this.draggedElm.offset.height;

    if (!allowTop && currentTop <= topThreshold) {
      return isRestrictedToThreshold
        ? topThreshold + this.innerOffset.y
        : this.#initCoordinates.y;
    }

    if (!allowBottom && currentBottom >= bottomThreshold) {
      return isRestrictedToThreshold
        ? bottomThreshold + this.innerOffset.y - this.draggedElm.offset.height
        : this.#initCoordinates.y;
    }

    return y;
  }

  private axesXFilter(
    x: number,
    leftThreshold: number,
    rightThreshold: number,
    allowLeft: boolean,
    allowRight: boolean,
    restrictToThreshold: boolean // if not. Then to self.,
  ) {
    const currentLeft = x - this.innerOffset.x;
    const currentRight = currentLeft + this.draggedElm.offset.width;

    if (!allowLeft && currentLeft <= leftThreshold) {
      return restrictToThreshold
        ? leftThreshold + this.innerOffset.x
        : this.#initCoordinates.x;
    }

    if (!allowRight && currentRight + this.#marginX >= rightThreshold) {
      return restrictToThreshold
        ? rightThreshold +
            this.innerOffset.x -
            this.draggedElm.offset.width -
            this.#marginX
        : this.#initCoordinates.x;
    }

    return x;
  }

  dragAt(x: number, y: number) {
    if (!this.#isLayoutStateUpdated) {
      this.#isLayoutStateUpdated = true;
      store.onStateChange("dragging");
    }

    let filteredY = y;
    let filteredX = x;

    const { SK } = store.registry[this.draggedElm.id].keys;

    if (this.#axesFilterNeeded) {
      const { boundaries } = store.containers[SK];
      const { top, bottom, left: maxLeft, right: minRight } = boundaries;

      if (this.#restrictionsStatus.isContainerRestricted) {
        filteredX = this.axesXFilter(
          x,
          maxLeft,
          minRight,
          this.#restrictions.container.allowLeavingFromLeft,
          this.#restrictions.container.allowLeavingFromRight,
          false
        );
        filteredY = this.axesYFilter(
          y,
          top,
          bottom,
          this.#restrictions.container.allowLeavingFromTop,
          this.#restrictions.container.allowLeavingFromBottom,
          true
        );
      } else if (this.#restrictionsStatus.isSelfRestricted) {
        filteredX = this.axesXFilter(
          x,
          maxLeft,
          minRight,
          this.#restrictions.self.allowLeavingFromLeft,
          this.#restrictions.self.allowLeavingFromRight,
          false
        );
        filteredY = this.axesYFilter(
          y,
          this.draggedElm.currentPosition.y,
          this.draggedElm.currentPosition.y + this.draggedElm.offset.height,
          this.#restrictions.self.allowLeavingFromTop,
          this.#restrictions.self.allowLeavingFromBottom,
          false
        );
      }
    } else if (this.isViewportRestricted) {
      // TODO: Test the fix this when scroll is implemented.
      filteredX = this.axesXFilter(
        x,
        0,
        store.containers[SK].scroll.getMaximumScrollContainerLeft(),
        false,
        false,
        true
      );
      filteredY = this.axesYFilter(
        y,
        0,
        store.containers[SK].scroll.getMaximumScrollContainerTop(),
        false,
        false,
        true
      );
    }

    this.translate(filteredX, filteredY);

    /**
     * Every time we got new translate, offset should be updated
     */
    this.positionPlaceholder.setAxes(
      filteredX - this.innerOffset.x,
      filteredY - this.innerOffset.y
    );
  }

  isOutThreshold(SK?: string) {
    const {
      id,
      offset: { height, width },
    } = this.draggedElm;

    const { x, y } = this.positionPlaceholder;

    const key = SK || id;

    return (
      this.threshold.isOutThresholdV(key, y, y + height) ||
      this.threshold.isOutThresholdH(key, x, x + width)
    );
  }

  #isLeavingFromTail() {
    const lastElm =
      (store.getElmBranchByKey(this.migration.latest().key) as string[])
        .length - 1;

    return (
      this.threshold.isOut[this.draggedElm.id].isLeftFromBottom &&
      this.migration.latest().index === lastElm
    );
  }

  isNotSettled() {
    return (
      !this.#isLeavingFromTail() &&
      (this.isOutThreshold() ||
        this.isOutThreshold(this.migration.latest().key))
    );
  }
}

export default DraggableAxes;
