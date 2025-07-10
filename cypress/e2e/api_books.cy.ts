describe("/Health", () => {
  it("deve retornar status OK no health", () => {
    cy.request("GET", "http://localhost:8000/health").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("status", "OK");
    });
  });
});

describe("/Books", () => {
  it("deve retornar lista de livros", () => {
    cy.request("GET", "http://localhost:8000/books").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.be.an("array");
    });
  });
});

describe("/Books/id", () => {
  it("deve retornar um livro por id", () => {
    const bookId = "100";
    cy.request("GET", `http://localhost:8000/books/${bookId}`).then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("id", bookId);
      }
    );
  });

  it("deve retornar uma mensagem de erro para livro não encontrado", () => {
    const bookId = "110";
    cy.request({
      method: "GET",
      url: `http://localhost:8000/books/${bookId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("error", "book ID 110 not found.");
    });
  });
});

describe("/Books/Genre", () => {
  it("deve retornar livros por gênero", () => {
    const genre = "fiction";
    cy.request("GET", `http://localhost:8000/books/genre/${genre}`).then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.be.an("array");
      }
    );
  });

  it("deve retornar erro para gênero inválido", () => {
    const invalidGenre = "fictions";
    cy.request({
      method: "GET",
      url: `http://localhost:8000/books/genre/${invalidGenre}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property(
        "error",
        "No books found with genre fictions."
      );
    });
  });
});
describe("/Books/author", () => {
  it("deve retornar sucesso para autor encontrado", () => {
    const existentAuthor = "João Pedro Rocha";
    cy.request({
      method: "GET",
      url: `http://localhost:8000/books/author/${existentAuthor}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.be.an("array");
      expect(response.body.page).to.have.property("totalItems");
      expect(response.body.page).to.have.property("totalPages");
      expect(response.body.page).to.have.property("currentPage");
    });
  });

  it("deve retornar erro para autor não encontrado", () => {
    const nonExistentAuthor = "nonexistent";
    cy.request({
      method: "GET",
      url: `http://localhost:8000/books/author/${nonExistentAuthor}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.be.an("array");
      expect(response.body.page).to.have.property("totalItems");
      expect(response.body.page).to.have.property("totalPages");
      expect(response.body.page).to.have.property("currentPage");
    });
  });
});

describe("/Books/recently-viewed", () => {
  it("deve retornar os 10 últimos livros visualizados", () => {
    const ids = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

    cy.wrap(ids).each((id) => {
      cy.request("GET", `http://localhost:8000/books/${id}`);
    });

    cy.request("GET", "http://localhost:8000/books/recently-viewed").then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array").with.length(10);

        const returnedIds = response.body.map((book: any) =>
          book.id.toString()
        );
        ids.forEach((id) => {
          expect(returnedIds).to.include(id);
        });
      }
    );
  });
});
