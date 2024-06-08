describe('Sign Up and Log In as a chef', () => {
    const getRandomString = () => Math.random().toString(36).substring(2, 10);
    //randomly generated username
    const newUser = {
      email: `user_${getRandomString()}@example.com`,
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      location: 'America',
      phoneNumber: '111-111-1113',
      cuisines: 'American',
      price: '300',
    };
  
    it('should sign up a new chef and create stuff', () => {
      cy.visit('http://localhost:5173/signup');
  
      cy.get('input[name="username"]').type(newUser.email);
      cy.get('input[name="password"]').type(newUser.password);
      cy.get('select[name="usertype"]').select('chef');
  
      cy.get('input[type="button"]').click();
  
      cy.url().should('include', '/profile');
      cy.get('input[id="firstName"]').type(newUser.firstName);
      cy.get('input[id="lastName"]').type(newUser.lastName);
      cy.get('input[id="location"]').type(newUser.location);
      cy.get('input[id="phoneNumber"]').type(newUser.phoneNumber);
      cy.get('input[id="cuisines"]').type(newUser.cuisines);
      cy.get('input[id="price"]').type(newUser.price);
      cy.get('input[value="Submit"]').click();
    });
  
    it('should log in the newly created user', () => {
      cy.visit('http://localhost:5173/login');
  
      cy.get('input[name="username"]').type(newUser.email);
      cy.get('input[name="password"]').type(newUser.password);
  
      cy.get('input[type="button"]').click();
  
      cy.url().should('include', '/search');
    });


    it('should visit their own profile and add a menu item', () => {
      cy.visit('http://localhost:5173/search');

      cy.get('.card').contains('John Doe').parents('.card').within(() => {
          cy.contains('button', 'Menu').click();
        });
      cy.url().should('include', '/menu');


  //should fill out and submit the add menu item form successfully
      cy.get('.view-profile-button').contains('button', 'View Profile').click();
      cy.url().should('include', '/viewprofile');
      cy.get('#foodName').type('Spaghetti');
      cy.get('#availability').check();
      cy.get('#price').type('50');
      cy.get('#cuisine').type('Italian');
      cy.get('#description').type('A classic Italian pasta dish.');
      cy.intercept('POST', 'http://localhost:8000/chefs/664fbcf07a311cad9a3e408a/menu', {
        statusCode: 201,
        body: { success: true },
      }).as('addItem');
      cy.get('button[type="submit"]').click();
      cy.wait('@addItem').its('response.statusCode').should('eq', 201);
      cy.get('#foodName').should('have.value', '');
      cy.get('#availability').should('not.be.checked');
      cy.get('#price').should('have.value', '');
      cy.get('#cuisine').should('have.value', '');
      cy.get('#description').should('have.value', '');
    });
  });
  