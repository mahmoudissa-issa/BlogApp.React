describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the home page and shows the hero section', () => {
    cy.get('h4').should('be.visible').and('contain.text', 'FullStack Blog App');
    cy.get('p').should('contain.text', 'Click a tag to explore posts by topic');
  });

  it('renders the search input', () => {
    cy.get('input.search-input').should('be.visible');
    cy.get('input.search-input').should('have.attr', 'placeholder', 'Search posts by title or author...');
  });

  it('filters posts by search query', () => {
    cy.get('input.search-input').type('test');
    cy.get('input.search-input').should('have.value', 'test');
  });

  it('shows the All tag button', () => {
    cy.get('button.tag-pill').first().should('contain.text', 'All').and('have.class', 'active');
  });

  it('switches active tag when a tag pill is clicked', () => {
    cy.get('button.tag-pill').eq(1).then(($btn) => {
      
      cy.wrap($btn).click();
      cy.wrap($btn).should('have.class', 'active');
      cy.get('button.tag-pill').first().should('not.have.class', 'active');
      // clicking All resets the filter
      cy.get('button.tag-pill').first().click();
      cy.get('button.tag-pill').first().should('have.class', 'active');
    });
  });
});