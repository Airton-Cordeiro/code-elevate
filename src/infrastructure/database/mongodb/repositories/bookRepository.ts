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
        error.statusCode = HttpStatus.SUCCESS;
        throw error;
      }

      const docs = await booksCollection
        .find({}, { projection: { _id: 0 } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .toArray();

      const books = docs.map((book: any) => new Book(book));
      const totalPages = Math.ceil(total / safeLimit);

      if (books.length === 0 && safePage > totalPages) {
        const error: any = new Error(
          `Page ${safePage} not found. Total pages available: ${totalPages}`
        );
        error.statusCode = HttpStatus.NOT_FOUND;
        throw error;
      }
      return {
        page: {
          totalItems: total,
          totalPages: totalPages,
          currentPage: safePage,
          limit: safeLimit,
        },
        data: books,
      };
    } catch (error: any) {
      console.log("Error fetching all books:", error);
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
        const error: any = new Error(`Book ID ${id} not found.`);
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
      genre = genre.toLowerCase();
      //@ts-ignore
      const total = await booksCollection.countDocuments({ genres: genre });

      if (total === 0) {
        const error: any = new Error(`No books found with genre ${genre}.`);
        error.statusCode = HttpStatus.NOT_FOUND;
        throw error;
      }
      const docs = await booksCollection
        .find({ genres: genre }, { projection: { _id: 0 } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .toArray();

      const books = docs.map((book: any) => new Book(book));

      const totalPages = Math.ceil(total / safeLimit);

      if (books.length === 0 && safePage > totalPages) {
        const error: any = new Error(
          `Page ${safePage} not found. Total pages available: ${totalPages}`
        );
        error.statusCode = HttpStatus.NOT_FOUND;
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

      if (total === 0) {
        const error: any = new Error(`No books found with author ${author}.`);
        error.statusCode = HttpStatus.NOT_FOUND;
        throw error;
      }
      const docs = await booksCollection
        .find({ author: author }, { projection: { _id: 0 } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .toArray();

      const books = docs.map((book: any) => new Book(book));

      const totalPages = Math.ceil(total / safeLimit);

      if (books.length === 0 && safePage > totalPages) {
        const error: any = new Error(
          `Page ${safePage} not found. Total pages available: ${totalPages}`
        );
        error.statusCode = HttpStatus.NOT_FOUND;
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
      console.info("Error fetching books by author:", error);
      throw error;
    }
  }
}

export default BookRepository;
