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


    cy.get('.card').then((el) => {
      cy.wrap(el).first().within(() => {
        cy.contains('button', 'Menu').click();
      });
    });
    

    cy.url().should('include', '/menu');
  });
  //everything below here is not done
  it('should make a review and verify it appears', () => {
    //gordon ramsay's profile
    cy.visit('http://localhost:5173/chef/664fbcf07a311cad9a3e4088/menu');
    const getRandomString = () => Math.random().toString(36).substring(2, 10);
    cy.get('input[name="username"]').type(newUser.email);
    cy.get('input[type="submit"]').click();

    cy.visit('http://localhost:5173/chef/664fbcf07a311cad9a3e4088/menu');

  });
  
  it('should place an order', () => {
    cy.visit('http://localhost:5173/login');

    cy.get('input[name="username"]').type(newUser.email);
    cy.get('input[name="password"]').type(newUser.password);

    cy.get('input[type="button"]').click();

    cy.url().should('include', '/search');
  });
});