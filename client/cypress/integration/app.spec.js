/// <reference types="cypress" />

describe('Cypress', () => {
    beforeEach(() => {
      cy.visit('/') // Visit the app
    })

    it('focuses the input', () => {
      cy.focused().should('have.id', 'user-input')
    })

    it('accepts input', () => {
      const input = "javascript"
      cy.get('#user-input')
        .type(input)
        .should('have.value', input)
    })

    it('API returns status code 200', () => {
      const userInput = "javascript"
      cy.request('/api/search', { params: {userInput: userInput, afterId: ''} })
        .should((response) => {
          expect(response.status).eq(200)
        })
    })

    it('Should be able to click the "Load More" button after a subreddit search', () => {
      const input = "javascript"
      cy.server()
      cy.route('GET', `/api/search?userInput=${input}&afterId=`).as('route1')
      cy.get('#user-input')
        .type(input)
        .type('{enter}')
      // Wait for response
      cy.wait('@route1')
      cy.get('[type="button"]').click()
    })

    it('Should display an error if no subreddits are found', () => {
      const input = "9d8fu9sd8fjdoi"
      cy.server()
      cy.route('GET', `/api/search?userInput=${input}&afterId=`).as('route1')
      cy.get('#user-input')
        .type(input)
        .type('{enter}')
      // Wait for response
      cy.wait('@route1')
      cy.get('#no-results').contains('No results found!')
    })
})