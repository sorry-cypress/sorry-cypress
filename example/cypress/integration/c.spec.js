describe('Suite C', function () {
  it('Welcomes you', function () {
    cy.visit('/');
    cy.wait(1000);
    cy.contains('This should fail');
  });

  it(
    'Shows 404',
    {
      retries: 3,
    },
    function () {
      cy.visit('/non-existing', {
        failOnStatusCode: false,
      });
      cy.contains('405');
    }
  );
});
