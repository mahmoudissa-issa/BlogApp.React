import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I visit the login page', () => {
  cy.visit('/login');
});

Then('I should see the heading {string}', (text: string) => {
  cy.get('h2').should('be.visible').and('contain.text', text);
});

Then('the email input should be visible', () => {
  cy.get('input#email').should('be.visible');
});

Then('the password input should be visible', () => {
  cy.get('input#password').should('be.visible');
});

Then('the Sign In button should be visible', () => {
  cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Sign In');
});

When('I click the Sign In button', () => {
  cy.get('button[type="submit"]').click();
});

Then('I should see at least one validation error', () => {
  cy.get('.text-danger').should('have.length.at.least', 1);
});

When('I type {string} in the email input', (value: string) => {
  cy.get('input#email').clear().type(value);
});

When('I type {string} in the password input', (value: string) => {
  cy.get('input#password').clear().type(value);
});

Then('the password input type should be {string}', (type: string) => {
  cy.get('input#password').should('have.attr', 'type', type);
});

When('I click the password toggle button', () => {
  cy.get('button[aria-label="Toggle password visibility"]').click();
});

Then('I should see a link to the register page', () => {
  cy.get('a.register-here')
    .should('be.visible')
    .and('have.attr', 'href', '/Register');
});

Then('I should see a link to the forgot password page', () => {
  cy.get('a.login-here')
    .should('be.visible')
    .and('have.attr', 'href', '/forgot-password');
});

When('I click the Register here link', () => {
  cy.get('a.register-here').click();
});

Then('the URL should contain {string}', (path: string) => {
  cy.url().should('include', path);
});
