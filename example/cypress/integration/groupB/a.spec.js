describe('Suite A', function () {
  it('Welcomes you', function () {
    cy.visit('/');
    cy.wait(1000);
    cy.contains('Google Search');
  });
});
