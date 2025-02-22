context(
  "Moves the element above the container Testing threshold for coming back",
  () => {
    let startingPointX: number;
    let startingPointY: number;
    let elmBox: DOMRect;

    let steps = 0;

    before(() => {
      cy.visit("http://localhost:3001/");
    });

    it("Getting the first element (container3 |> elm-1)", () => {
      cy.get("#id-9").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#id-9").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Moves the element up outside the container", () => {
      steps = 100;

      for (let i = 0; i < steps; i += 10) {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("The element is coming back, inside the threshold but outside position", () => {
      steps = 100;

      for (let i = steps; i > 65; i -= 10) {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Sibling must hold their positions", () => {
      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );

      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Triggers mouse up", () => {
      cy.get("#id-9").trigger("mouseup", { force: true });
    });

    it("Siblings back to normal", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  }
);
