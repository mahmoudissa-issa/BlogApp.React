import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I visit the home page', () => {
  cy.visit('/');
});

Then('I should see the hero heading {string}', (text: string) => {
  cy.get('h4').should('be.visible').and('contain.text', text);
});

Then('I should see the subtitle {string}', (text: string) => {
  cy.get('p').should('contain.text', text);
});

Then('the search input should be visible', () => {
  cy.get('input.search-input').should('be.visible');
});

Then('the search input placeholder should be {string}', (placeholder: string) => {
  cy.get('input.search-input').should('have.attr', 'placeholder', placeholder);
});

When('I type {string} in the search input', (query: string) => {
  cy.get('input.search-input').clear().type(query);
});

Then('the search input should have the value {string}', (value: string) => {
  cy.get('input.search-input').should('have.value', value);
});

Then('the first tag pill should contain {string}', (text: string) => {
  cy.get('button.tag-pill').first().should('contain.text', text);
});

Then('the first tag pill should be active', () => {
  cy.get('button.tag-pill').first().should('have.class', 'active');
});

Then('the first tag pill should not be active', () => {
  cy.get('button.tag-pill').first().should('not.have.class', 'active');
});

When('I click the second tag pill', () => {
  cy.get('button.tag-pill').eq(1).click();
});

Then('the second tag pill should be active', () => {
  cy.get('button.tag-pill').eq(1).should('have.class', 'active');
});

When('I click the first tag pill', () => {
  cy.get('button.tag-pill').first().click();
});
