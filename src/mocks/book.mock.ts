import { Book } from "../domain/entities/book";

export const mockBookData = {
  id: "1",
  title: "Livro Exemplo",
  subtitle: "Subtítulo Exemplo",
  author: "Autor Exemplo",
  publisher: "Editora Exemplo",
  publicationDate: "2023-01-01",
  language: "Português",
  genres: ["Ficção", "Aventura"],
  pages: 300,
  format: "Capa dura",
  description: "Descrição de exemplo do livro.",
  coverImageUrl: "https://exemplo.com/capa.jpg",
  price: 49.9,
  availability: "Disponível",
  averageRating: 4.5,
  tags: ["tag1", "tag2"],
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-02T00:00:00Z",
};

export function createMockBook(overrides = {}) {
  return new Book({ ...mockBookData, ...overrides } as any);
}

export const mockBook = createMockBook();

export const mockBooksArray = [
  mockBook,
  createMockBook({ id: "2", title: "Outro Livro" }),
];
