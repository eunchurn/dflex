context("Swinging - Confusion starts form bottom/up", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  let steps: number;

  before(() => {
    cy.visit("http://localhost:3001");
  });

  it("Transforms (container3 |> elm-4) out", () => {
    cy.get("#id-12").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-12").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms (container3 |> elm-4) in threshold confusion", () => {
    // steps = elmBox.height + 2 + 180;
    steps = elmBox.height;

    for (let i = 0; i < steps; i += 10) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Checking the stability of the new positions - 1", () => {
    cy.get("#id-9").should("have.css", "transform", "none");

    cy.get("#id-10").should("have.css", "transform", "none");

    cy.get("#id-11").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );
  });

  it("Continue movement - 1", () => {
    for (let i = steps; i < steps + 45; i += 10) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    steps += 45;
  });

  it("Checking the stability of the new positions - 2", () => {
    cy.get("#id-9").should("have.css", "transform", "none");

    cy.get("#id-10").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );

    cy.get("#id-11").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );
  });

  it("Continue movement - 2", () => {
    for (let i = steps; i < steps + 45; i += 10) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    steps += 45;
  });

  it("Checking the stability of the new positions - 3", () => {
    cy.get("#id-9").should("have.css", "transform", "none");

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
  });

  it("Continue movement - 3", () => {
    for (let i = steps; i < steps + 45; i += 10) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    steps += 45;
  });

  it("Getting in", () => {
    for (let i = steps; i > 0; i -= 10) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Triggers mouseup", () => {
    cy.get("#id-9").trigger("mouseup", { force: true });
  });

  it("Checking new positions", () => {
    cy.get("#id-9").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );

    cy.get("#id-10").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );

    cy.get("#id-11").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );

    cy.get("#id-12").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -174)"
    );
  });
});
