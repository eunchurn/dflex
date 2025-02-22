import { Draggable, store } from "../src";

const ref = document.createElement("div");

const elmInstance1 = {
  id: "id-0",
  depth: 0,
  ref,
};

store.register(elmInstance1);

describe("Draggable Only Package", () => {
  let EXPECTED_TRANSLATE_X_R1: number;
  let EXPECTED_TRANSLATE_Y_R1: number;

  describe("FIRST ROUND", () => {
    const START_CLIENT_X_R1 = 10;
    const START_CLIENT_Y_R1 = 20;

    let EXPECTED_OFFSET_X_R1: number;
    let EXPECTED_OFFSET_Y_R1: number;

    const MOVING_PIXELS_R1 = 50;

    let draggable: Draggable;

    beforeAll(() => {
      EXPECTED_TRANSLATE_X_R1 = store.registry[elmInstance1.id].translate.x;
      EXPECTED_TRANSLATE_Y_R1 = store.registry[elmInstance1.id].translate.y;

      EXPECTED_OFFSET_X_R1 = -START_CLIENT_X_R1 + EXPECTED_TRANSLATE_X_R1;
      EXPECTED_OFFSET_Y_R1 = -START_CLIENT_Y_R1 + EXPECTED_TRANSLATE_Y_R1;

      draggable = new Draggable(elmInstance1.id, {
        x: START_CLIENT_X_R1,
        y: START_CLIENT_Y_R1,
      });
    });

    describe("Stimulates mousedown click - Inits draggable", () => {
      it("TranslateX/Y are zeros", () => {
        expect(EXPECTED_TRANSLATE_X_R1).toEqual(0);
        expect(EXPECTED_TRANSLATE_Y_R1).toEqual(0);
      });

      it("matches values in draggable with those in store", () => {
        expect(draggable.draggedElm.translate.x).toEqual(
          EXPECTED_TRANSLATE_X_R1
        );
        expect(draggable.draggedElm.translate.y).toEqual(
          EXPECTED_TRANSLATE_Y_R1
        );
      });

      it("Calculates offset", () => {
        expect(draggable.outerOffset.x).toEqual(EXPECTED_OFFSET_X_R1);
        expect(draggable.outerOffset.y).toEqual(EXPECTED_OFFSET_Y_R1);
      });
    });

    describe("Stimulates mousemove - Checks dragAt()", () => {
      beforeAll(() => {
        for (let i = 0; i < MOVING_PIXELS_R1; i += 1) {
          draggable.dragAt(START_CLIENT_X_R1 + i, START_CLIENT_Y_R1 + i);

          EXPECTED_TRANSLATE_X_R1 =
            START_CLIENT_X_R1 + i + EXPECTED_OFFSET_X_R1;
          EXPECTED_TRANSLATE_Y_R1 =
            START_CLIENT_Y_R1 + i + EXPECTED_OFFSET_Y_R1;
        }
      });

      it("Offset never change", () => {
        expect(draggable.outerOffset.x).toEqual(EXPECTED_OFFSET_X_R1);
        expect(draggable.outerOffset.y).toEqual(EXPECTED_OFFSET_Y_R1);
      });

      it("Draggable updates translateX/Y in store", () => {
        expect(draggable.draggedElm.translate.x).toEqual(
          EXPECTED_TRANSLATE_X_R1
        );
        expect(draggable.draggedElm.translate.y).toEqual(
          EXPECTED_TRANSLATE_Y_R1
        );

        draggable.endDragging();
      });
    });
  });

  describe("SECOND ROUND", () => {
    let EXPECTED_TRANSLATE_X_R2: number;
    let EXPECTED_TRANSLATE_Y_R2: number;

    const START_CLIENT_X_R2 = 100;
    const START_CLIENT_Y_R2 = 80;

    let EXPECTED_OFFSET_X_R2: number;
    let EXPECTED_OFFSET_Y_R2: number;

    const MOVING_PIXELS_R2 = 18;

    let draggable: Draggable;

    beforeAll(() => {
      EXPECTED_TRANSLATE_X_R2 = store.registry[elmInstance1.id].translate.x;
      EXPECTED_TRANSLATE_Y_R2 = store.registry[elmInstance1.id].translate.y;

      EXPECTED_OFFSET_X_R2 = -START_CLIENT_X_R2 + EXPECTED_TRANSLATE_X_R2;
      EXPECTED_OFFSET_Y_R2 = -START_CLIENT_Y_R2 + EXPECTED_TRANSLATE_Y_R2;

      draggable = new Draggable(elmInstance1.id, {
        x: START_CLIENT_X_R2,
        y: START_CLIENT_Y_R2,
      });
    });

    describe("Stimulates mousedown click - Inits draggable", () => {
      it("TranslateX/Y are not zeros", () => {
        expect(EXPECTED_TRANSLATE_X_R2).toBeGreaterThan(0);
        expect(EXPECTED_TRANSLATE_Y_R2).toBeGreaterThan(0);
      });

      it("TranslateX/Y are matching last position", () => {
        expect(EXPECTED_TRANSLATE_X_R2).toEqual(EXPECTED_TRANSLATE_X_R1);
        expect(EXPECTED_TRANSLATE_Y_R2).toEqual(EXPECTED_TRANSLATE_Y_R1);
      });

      it("Calculates offset", () => {
        expect(draggable.outerOffset.x).toEqual(EXPECTED_OFFSET_X_R2);
        expect(draggable.outerOffset.y).toEqual(EXPECTED_OFFSET_Y_R2);
      });
    });

    describe("Stimulates mousemove - Checks dragAt()", () => {
      beforeAll(() => {
        for (let i = 0; i < MOVING_PIXELS_R2; i += 1) {
          draggable.dragAt(START_CLIENT_X_R2 + i, START_CLIENT_Y_R2 + i);

          EXPECTED_TRANSLATE_X_R2 =
            START_CLIENT_X_R2 + i + EXPECTED_OFFSET_X_R2;
          EXPECTED_TRANSLATE_Y_R2 =
            START_CLIENT_Y_R2 + i + EXPECTED_OFFSET_Y_R2;
        }
      });

      it("Offset never change", () => {
        expect(draggable.outerOffset.x).toEqual(EXPECTED_OFFSET_X_R2);
        expect(draggable.outerOffset.y).toEqual(EXPECTED_OFFSET_Y_R2);
      });

      it("Draggable updates translateX/Y in store", () => {
        expect(draggable.draggedElm.translate.x).toEqual(
          EXPECTED_TRANSLATE_X_R2
        );
        expect(draggable.draggedElm.translate.y).toEqual(
          EXPECTED_TRANSLATE_Y_R2
        );
        draggable.endDragging();
      });
    });
  });
});
