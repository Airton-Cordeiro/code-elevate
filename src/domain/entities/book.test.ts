import { Book } from "./book";
import { mockBookData, createMockBook } from "../../mocks/book.mock";

describe("Book Entity", () => {
  it("deve criar uma instância de Book corretamente", () => {
    const book = new Book(mockBookData as any);
    expect(book).toBeInstanceOf(Book);
    expect(book.id).toBe(mockBookData.id);
    expect(book.title).toBe(mockBookData.title);
    expect(book.author).toBe(mockBookData.author);
    expect(book.genres).toEqual(mockBookData.genres);
  });

  it("deve validar um livro válido sem lançar erro", () => {
    const book = createMockBook();
    expect(() => book.validate()).not.toThrow();
  });

  it("deve lançar erro se faltar campo obrigatório", () => {
    const book = createMockBook({ id: undefined });
    expect(() => book.validate()).toThrow("ID is a required field");
  });

  it("deve lançar erro se pages for menor ou igual a zero", () => {
    const book = createMockBook({ pages: 0 });
    expect(() => book.validate()).toThrow("Pages must be a positive number.");
  });

  it("deve lançar erro se averageRating for fora do intervalo", () => {
    const book = createMockBook({ averageRating: 6 });
    expect(() => book.validate()).toThrow(
      "Average rating must be between 0 and 5."
    );
  });

  it("deve lançar erro se genres não for array", () => {
    const book = createMockBook({ genres: undefined });
    expect(() => book.validate()).toThrow("Genres must be an array.");
  });

  it("deve lançar erro se tags não for array", () => {
    const book = createMockBook({ tags: undefined });
    expect(() => book.validate()).toThrow("Tags must be an array.");
  });

  it("deve lançar erro se faltar title", () => {
    const book = createMockBook({ title: undefined });
    expect(() => book.validate()).toThrow("Title is a required field");
  });

  it("deve lançar erro se faltar subtitle", () => {
    const book = createMockBook({ subtitle: undefined });
    expect(() => book.validate()).toThrow("Subtitle is a required field.");
  });

  it("deve lançar erro se faltar author", () => {
    const book = createMockBook({ author: undefined });
    expect(() => book.validate()).toThrow("Author is a required field.");
  });

  it("deve lançar erro se faltar publisher", () => {
    const book = createMockBook({ publisher: undefined });
    expect(() => book.validate()).toThrow("Publisher is a required field.");
  });

  it("deve lançar erro se faltar publicationDate", () => {
    const book = createMockBook({ publicationDate: undefined });
    expect(() => book.validate()).toThrow(
      "Publication date is a required field."
    );
  });

  it("deve lançar erro se faltar language", () => {
    const book = createMockBook({ language: undefined });
    expect(() => book.validate()).toThrow("Language is a required field.");
  });

  it("deve lançar erro se faltar format", () => {
    const book = createMockBook({ format: undefined });
    expect(() => book.validate()).toThrow("Format is a required field.");
  });

  it("deve lançar erro se faltar description", () => {
    const book = createMockBook({ description: undefined });
    expect(() => book.validate()).toThrow("Description is a required field.");
  });

  it("deve lançar erro se faltar coverImageUrl", () => {
    const book = createMockBook({ coverImageUrl: undefined });
    expect(() => book.validate()).toThrow(
      "Cover image URL is a required field."
    );
  });

  it("deve lançar erro se faltar price", () => {
    const book = createMockBook({ price: undefined });
    expect(() => book.validate()).toThrow("Price is a required field.");
  });

  it("deve lançar erro se faltar availability", () => {
    const book = createMockBook({ availability: undefined });
    expect(() => book.validate()).toThrow("Availability is a required field.");
  });

  it("deve lançar erro se faltar createdAt", () => {
    const book = createMockBook({ createdAt: undefined });
    expect(() => book.validate()).toThrow("Created at is a required field.");
  });

  it("deve lançar erro se faltar updatedAt", () => {
    const book = createMockBook({ updatedAt: undefined });
    expect(() => book.validate()).toThrow("Updated at is a required field.");
  });

  it("deve lançar erro se averageRating for negativo", () => {
    const book = createMockBook({ averageRating: -1 });
    expect(() => book.validate()).toThrow(
      "Average rating must be between 0 and 5."
    );
  });

  it("deve lançar erro se genres não for array (valor string)", () => {
    const book = createMockBook({ genres: "Ficção" });
    expect(() => book.validate()).toThrow("Genres must be an array.");
  });

  it("deve lançar erro se tags não for array (valor string)", () => {
    const book = createMockBook({ tags: "tag1" });
    expect(() => book.validate()).toThrow("Tags must be an array.");
  });
});
