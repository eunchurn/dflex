context(
  "Moves out, goes back to the same position, settles in, moves another element",
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

    it("Moves the element down to the bottom", () => {
      steps = 180;

      for (let i = 0; i < steps; i += 10) {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Siblings hold new positions up", () => {
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

    it("Returns to the same old position", () => {
      for (let i = steps; i > 0; i -= 10) {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      steps = 0;
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

    it("Getting second element (container3 |> elm-2)", () => {
      cy.get("#id-10").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#id-10").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Moves the element up ,outside", () => {
      steps = 150;

      for (let i = 0; i < steps; i += 10) {
        cy.get("#id-10").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Siblings must hold new positions up", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
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

    it("Moves it down to the top of the list", () => {
      steps = 120;

      for (let i = steps; i > 75; i -= 10) {
        cy.get("#id-10").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouse up for id-10", () => {
      cy.get("#id-10").trigger("mouseup", { force: true });
    });

    it("Container has new positions", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 58)"
      );

      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
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
