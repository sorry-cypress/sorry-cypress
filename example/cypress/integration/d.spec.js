describe('Suite D', function() {
  it('Welcomes you', function() {
    cy.visit('/');
    cy.wait(1000);
    cy.contains('Hello and sorry Cypress');
  });

  it('Shows 404', function() {
    cy.visit('/non-existing', {
      failOnStatusCode: false
    });
    cy.contains('404');
  });
});
