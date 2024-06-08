describe('Sign Up and Log In', () => {
  const getRandomString = () => Math.random().toString(36).substring(2, 10);
  //randomly generated username
  const newUser = {
    email: `user_${getRandomString()}@example.com`,
    password: 'Password123!',
  };

  it('should sign up a new user', () => {
    cy.visit('http://localhost:5173/signup');

    cy.get('input[name="username"]').type(newUser.email);
    cy.get('input[name="password"]').type(newUser.password);
    cy.get('select[name="usertype"]').select('user');

    cy.get('input[type="button"]').click();

    cy.url().should('include', '/search');
  });

  it('should log in the newly created user', () => {
    cy.visit('http://localhost:5173/login');

    cy.get('input[name="username"]').type(newUser.email);
    cy.get('input[name="password"]').type(newUser.password);

    cy.get('input[type="button"]').click();

    cy.url().should('include', '/search');
  });
});

describe('Filtering chefs', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173/search'); 
  });

  it('filter by cuisine correctly, for example American', () => {
    cy.visit('http://localhost:5173/search');

    cy.get('input[name="search-input"]').type("American");

    cy.get('button[type="submit"]').click();
    //waiting for search results to load before testing 
    cy.wait(500)
    cy.get('.card').each((el) => {
      cy.wrap(el).within(() => {
        cy.get('p').contains('Cuisines:').then((cuisine) => {
          expect(cuisine.text()).to.include('American');
        });


      });
    });
  });
  
  it('filter by min and max price correctly', () => {
    cy.visit('http://localhost:5173/search');

    cy.get('input[id="min-price"]').type(100);
    cy.get('input[id="max-price"]').type(200);

    cy.get('button[type="submit"]').click();
    //waiting for search results to load before testing 
    cy.wait(500)
    cy.get('.card').each((el) => {
      cy.wrap(el).within(() => {
        cy.get('p').contains('Price:').then((price) => {
          expect(parseFloat(price.text().replace('Price: ', ''))).to.be.within(100, 200);
        });
      });
    });
  });

});



describe('Visiting a chef\'s profile', () => {

  it('should visit a profile from search', () => {
    cy.visit('http://localhost:5173/search');


    cy.get('.card').first().within(() => {
        cy.contains('button', 'Menu').click();
      });
    
    

    cy.url().should('include', '/menu');
  });

  it('should place an order and submit the order form successfully (alice waters as example)', () => {
    cy.visit('http://localhost:5173/search');
    cy.get('.card').contains('Alice Waters').parents('.card').within(() => {
      cy.contains('button', 'Menu').click();
    });

    cy.contains('button', 'Place an Order').click();  
    cy.url().should('include', '/placeorder');
        cy.get('#orderDirections').type('Would not like any utensils.');
        cy.get('#people').clear().type('4');
        cy.get('#phoneNumber').clear().type('1234567890');
        cy.get('#asap').select('yes');
        cy.intercept('POST', 'http://localhost:8000/chefs/664fbcf07a311cad9a3e408a/order', {
          statusCode: 201,
          body: { success: true },
        }).as('submitOrder');
        cy.get('input[value="Submit"]').click();
        cy.wait('@submitOrder').its('response.statusCode').should('eq', 201);
      
    });

    
    it('should make a review', () => {
    //gordon ramsay's profile
    cy.visit('http://localhost:5173/search');
    cy.get('.card').contains('Gordon Ramsay').parents('.card').within(() => {
      cy.contains('button', 'Menu').click();
    });

    cy.intercept('POST', 'http://localhost:8000/chefs/664fbcf07a311cad9a3e4088/reviews', {
      statusCode: 201,
      body: { success: true },
    }).as('postReview');

    cy.get('input[name="comments"]').type('Great experience!');
    cy.get('.react-stars span').eq(3).click(); 
    cy.get('input[type="submit"]').click();
    cy.wait('@postReview').its('response.statusCode').should('eq', 201);

  });
  
  
});