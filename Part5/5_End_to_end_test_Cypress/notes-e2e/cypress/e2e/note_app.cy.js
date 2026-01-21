describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2025')
  })

  it('user can login', function() {
    cy.contains('button', 'login').click()
    cy.contains('label', 'username').type('mluukkai')
    cy.contains('label', 'password').type('salainen')
    cy.get('#login-button').click()
    cy.contains('Matti Luukkainen logged in')
  })

  it('login fails with wrong password', function() {
    cy.contains('button', 'login').click()
    cy.contains('label', 'username').type('mluukkai')
    cy.contains('label', 'password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function() {
      beforeEach(function() {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made not important', function() {
        cy.contains('another note cypress')
          .contains('button', 'make not important')
          .click()

        cy.contains('another note cypress')
          .contains('button', 'make important')
      })
    })

    describe('and several notes exist', function() {
      beforeEach(function() {
        cy.createNote({ content: 'first note', important: true })
        cy.createNote({ content: 'second note', important: true })
        cy.createNote({ content: 'third note', important: true })
      })

      it('one of those can be made non important', function() {
        cy.contains('second note')
          .contains('button', 'make not important')
          .click()

        cy.contains('second note')
          .contains('button', 'make important')
      })
    })
  })
})
