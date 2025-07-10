import BookRepository from "./bookRepository";
import {
  mockBook,
  mockBooksArray,
  mockBookData,
} from "../../../../mocks/book.mock";
import { mongoDB } from "../connection/mongodb-connection";

jest.mock("../connection/mongodb-connection", () => ({
  mongoDB: {
    getDb: jest.fn(),
  },
}));

const mockCollection = {
  countDocuments: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockFindCursor = {
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
};

describe("BookRepository (MongoDB)", () => {
  let repo: BookRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new BookRepository();
    (mongoDB.getDb as jest.Mock).mockReturnValue({
      collection: jest.fn(() => mockCollection),
    });
  });

  it("deve retornar livros paginados em getAllBooks", async () => {
    mockCollection.countDocuments.mockResolvedValue(2);
    mockCollection.find.mockReturnValue(mockFindCursor);
    mockFindCursor.toArray.mockResolvedValue([
      mockBookData,
      { ...mockBookData, id: "2" },
    ]);

    const result = await repo.getAllBooks(1, 10);
    expect(result.data).toHaveLength(2);
    expect(result.page.totalItems).toBe(2);
    expect(mockCollection.countDocuments).toHaveBeenCalled();
    expect(mockCollection.find).toHaveBeenCalled();
  });

  it("deve usar valores padrão para paginação inválida em getAllBooks", async () => {
    mockCollection.countDocuments.mockResolvedValue(1);
    mockCollection.find.mockReturnValue(mockFindCursor);
    mockFindCursor.toArray.mockResolvedValue([mockBookData]);
    const result = await repo.getAllBooks(-1, 0);
    expect(result.page.currentPage).toBe(1);
    expect(result.page.limit).toBe(10);
  });

  it("deve retornar um livro em getBookById", async () => {
    mockCollection.findOne.mockResolvedValue(mockBookData);

    const result = await repo.getBookById("1");
    expect(result).toBeInstanceOf(Object);
    expect(mockCollection.findOne).toHaveBeenCalledWith(
      { id: "1" },
      { projection: { _id: 0 } }
    );
  });

  it("deve lançar erro se livro não existir em getBookById", async () => {
    mockCollection.findOne.mockResolvedValue(undefined);

    await expect(repo.getBookById("999")).rejects.toThrow(
      "Livro com ID 999 não encontrado."
    );
  });

  it("deve capturar e lançar erro em getBookById", async () => {
    mockCollection.findOne.mockRejectedValue(new Error("Erro de banco"));
    await expect(repo.getBookById("1")).rejects.toThrow("Erro de banco");
  });

  it("deve retornar livros por gênero em getBooksByGenre", async () => {
    mockCollection.countDocuments.mockResolvedValue(1);
    mockCollection.find.mockReturnValue(mockFindCursor);
    mockFindCursor.toArray.mockResolvedValue([mockBookData]);

    const result = await repo.getBooksByGenre(1, 10, "Ficção");
    expect(result.data).toHaveLength(1);
    expect(result.page.totalItems).toBe(1);
    expect(mockCollection.countDocuments).toHaveBeenCalledWith({
      genres: "Ficção",
    });
    expect(mockCollection.find).toHaveBeenCalledWith(
      { genres: "Ficção" },
      { projection: { _id: 0 } }
    );
  });

  it("deve usar valores padrão para paginação inválida em getBooksByGenre", async () => {
    mockCollection.countDocuments.mockResolvedValue(0);
    mockCollection.find.mockReturnValue(mockFindCursor);
    mockFindCursor.toArray.mockResolvedValue([]);
    const result = await repo.getBooksByGenre(-1, 0, "Ficção");
    expect(result.page.currentPage).toBe(1);
    expect(result.page.limit).toBe(10);
  });

  it("deve capturar e lançar erro em getBooksByGenre", async () => {
    mockCollection.countDocuments.mockRejectedValue(new Error("Erro de banco"));
    await expect(repo.getBooksByGenre(1, 10, "Ficção")).rejects.toThrow(
      "Erro de banco"
    );
  });

  it("deve retornar livros por autor em getBooksByAuthor", async () => {
    mockCollection.countDocuments.mockResolvedValue(1);
    mockCollection.find.mockReturnValue(mockFindCursor);
    mockFindCursor.toArray.mockResolvedValue([mockBookData]);

    const result = await repo.getBooksByAuthor(1, 10, "Autor Exemplo");
    expect(result.data).toHaveLength(1);
    expect(result.page.totalItems).toBe(1);
    expect(mockCollection.countDocuments).toHaveBeenCalledWith({
      author: "Autor Exemplo",
    });
    expect(mockCollection.find).toHaveBeenCalledWith(
      { author: "Autor Exemplo" },
      { projection: { _id: 0 } }
    );
  });

  it("deve usar valores padrão para paginação inválida em getBooksByAuthor", async () => {
    mockCollection.countDocuments.mockResolvedValue(0);
    mockCollection.find.mockReturnValue(mockFindCursor);
    mockFindCursor.toArray.mockResolvedValue([]);
    const result = await repo.getBooksByAuthor(-1, 0, "Autor Exemplo");
    expect(result.page.currentPage).toBe(1);
    expect(result.page.limit).toBe(10);
  });

  it("deve capturar e lançar erro em getBooksByAuthor", async () => {
    mockCollection.countDocuments.mockRejectedValue(new Error("Erro de banco"));
    await expect(repo.getBooksByAuthor(1, 10, "Autor Exemplo")).rejects.toThrow(
      "Erro de banco"
    );
  });

  it("deve capturar e lançar erro em getAllBooks", async () => {
    mockCollection.countDocuments.mockRejectedValue(new Error("Erro de banco"));
    await expect(repo.getAllBooks(1, 10)).rejects.toThrow("Erro de banco");
  });
});
