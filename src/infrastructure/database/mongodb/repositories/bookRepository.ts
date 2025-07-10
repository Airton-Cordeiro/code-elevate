import IBookRepository, {
  IPaginatedBooksResponse,
} from "../../../../domain/repositories/bookRepository";
import { Book } from "../../../../domain/entities/book";

import { mongoDB } from "../connection/mongodb-connection";
import HttpStatus from "../../../../utils/httpStatus";
//@ts-ignore
class BookRepository implements IBookRepository {
  async getAllBooks(
    page: number,
    limit: number
  ): Promise<IPaginatedBooksResponse> {
    try {
      const db = mongoDB.getDb();

      //@ts-ignore
      const booksCollection = db.collection("books");
      const safePage = Number(page) > 0 ? Number(page) : 1;
      const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
      const skip = (safePage - 1) * safeLimit;

      //@ts-ignore
      const total = await booksCollection.countDocuments();

      if (!total) {
        const error: any = new Error(`books not found.`);
        error.statusCode = HttpStatus.NOT_FOUND;
        throw error;
      }

      const docs = await booksCollection
        .find({}, { projection: { _id: 0 } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .toArray();

      const books = docs.map((book: any) => new Book(book));

      if (books.length === 0 && total > 0) {
        const skip = 10;
        const safeLimit = 10;

        const docs = await booksCollection
          .find({}, { projection: { _id: 0 } })
          .sort({ _id: -1 })
          .skip(skip)
          .limit(safeLimit)
          .toArray();

        const books = docs.map((book: any) => new Book(book));

        return {
          page: {
            totalItems: total,
            totalPages: Math.ceil(total / safeLimit),
            currentPage: safePage,
            limit: safeLimit,
          },
          data: books,
        };
      }
      return {
        page: {
          totalItems: total,
          totalPages: Math.ceil(total / safeLimit),
          currentPage: safePage,
          limit: safeLimit,
        },
        data: books,
      };
    } catch (error: any) {
      error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      throw error;
    }
  }

  async getBookById(id: string): Promise<Book | []> {
    try {
      const db = mongoDB.getDb();
      //@ts-ignore
      const booksCollection = db.collection<WithId<Book>>("books");

      const book = await booksCollection.findOne(
        { id: id },
        { projection: { _id: 0 } }
      );

      if (!book) {
        const error: any = new Error(`Livro com ID ${id} não encontrado.`);
        error.statusCode = HttpStatus.NOT_FOUND;
        throw error;
      }
      return new Book(book);
    } catch (error) {
      console.log("Error fetching book by ID:", error);
      throw error;
    }
  }

  async getBooksByGenre(
    page: number,
    limit: number,
    genre: string
  ): Promise<IPaginatedBooksResponse> {
    try {
      const db = mongoDB.getDb();
      //@ts-ignore
      const booksCollection = db.collection("books");
      const safePage = Number(page) > 0 ? Number(page) : 1;
      const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
      const skip = (safePage - 1) * safeLimit;

      //@ts-ignore
      const total = await booksCollection.countDocuments({ genres: genre });
      const docs = await booksCollection
        .find({ genres: genre }, { projection: { _id: 0 } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .toArray();

      const books = docs.map((book: any) => new Book(book));

      if (books.length === 0) {
        const error: any = new Error(`No books found with genre ${genre}.`);
        error.statusCode = HttpStatus.SUCCESS;
        throw error;
      }
      return {
        page: {
          totalItems: total,
          totalPages: Math.ceil(total / safeLimit),
          currentPage: safePage,
          limit: safeLimit,
        },
        data: books,
      };
    } catch (error) {
      console.info("Error fetching books by genre:", error);
      throw error;
    }
  }

  async getBooksByAuthor(
    page: number,
    limit: number,
    author: string
  ): Promise<IPaginatedBooksResponse> {
    try {
      const db = mongoDB.getDb();
      //@ts-ignore
      const booksCollection = db.collection("books");
      const safePage = Number(page) > 0 ? Number(page) : 1;
      const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
      const skip = (safePage - 1) * safeLimit;

      //@ts-ignore
      const total = await booksCollection.countDocuments({ author: author });
      const docs = await booksCollection
        .find({ author: author }, { projection: { _id: 0 } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .toArray();

      const books = docs.map((book: any) => new Book(book));
      return {
        page: {
          totalItems: total,
          totalPages: Math.ceil(total / safeLimit),
          currentPage: safePage,
          limit: safeLimit,
        },
        data: books,
      };
    } catch (error) {
      console.info("Erro ao buscar livros por autor:", error);
      throw error;
    }
  }
}

export default BookRepository;
