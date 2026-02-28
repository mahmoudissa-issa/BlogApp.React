describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('loads the login page with the heading', () => {
    cy.get('h2').should('be.visible').and('contain.text', 'Sign in to your account');
  });

  it('renders email and password inputs', () => {
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
  });

  it('renders the Sign In button', () => {
    cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Sign In');
  });

  it('shows validation errors when submitting empty form', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.text-danger').should('have.length.at.least', 1);
  });

  it('shows validation error for invalid email', () => {
    cy.get('input#email').type('not-an-email');
    cy.get('input#password').type('short');
    cy.get('button[type="submit"]').click();
    cy.get('.text-danger').should('be.visible');
  });

  it('toggles password visibility', () => {
    cy.get('input#password').should('have.attr', 'type', 'password');
    cy.get('button[aria-label="Toggle password visibility"]').click();
    cy.get('input#password').should('have.attr', 'type', 'text');
    cy.get('button[aria-label="Toggle password visibility"]').click();
    cy.get('input#password').should('have.attr', 'type', 'password');
  });

  it('has a link to the Register page', () => {
    cy.get('a.register-here')
      .should('be.visible')
      .and('have.attr', 'href', '/Register');
  });

  it('has a Forgot password link', () => {
    cy.get('a.login-here')
      .should('be.visible')
      .and('have.attr', 'href', '/forgot-password');
  });

  it('navigates to Register page when clicking Register here', () => {
    cy.get('a.register-here').click();
    cy.url().should('include', '/Register');
  });
});
