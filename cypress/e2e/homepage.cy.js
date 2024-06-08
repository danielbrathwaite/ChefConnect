describe("Home Page", () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit("http://localhost:5173");
  });

  it("should display the home page correctly", () => {
    cy.contains("Welcome to ChefConnect!").should("be.visible");
    cy.contains("Log In").should("be.visible");
    cy.contains("Sign Up").should("be.visible");
  });

  it('should navigate to the Sign Up page when the "Sign Up" link is clicked', () => {
    cy.contains("Sign Up").click();
    cy.url().should("include", "/signup");
    cy.contains("UserName").should("be.visible");
    cy.contains("Password").should("be.visible");
    cy.contains("I'm here to ...").should("be.visible");
  });

  it('should navigate to the Log In page when the "Log In" link is clicked', () => {
    cy.contains("Log In").click();
    cy.url().should("include", "/login");
    cy.contains("UserName").should("be.visible");
    cy.contains("Password").should("be.visible");
  });
});
