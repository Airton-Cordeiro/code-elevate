class Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publisher: string;
  publicationDate: string;
  language: string;
  genres: string[];
  pages: number;
  format: string;
  description: string;
  coverImageUrl: string;
  price: number;
  availability: string;
  averageRating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;

  constructor({
    id,
    title,
    subtitle,
    author,
    publisher,
    publicationDate,
    language,
    genres,
    pages,
    format,
    description,
    coverImageUrl,
    price,
    availability,
    averageRating,
    tags,
    createdAt,
    updatedAt,
  }: Book) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.author = author;
    this.publisher = publisher;
    this.publicationDate = publicationDate;
    this.language = language;
    this.genres = genres;
    this.pages = pages;
    this.format = format;
    this.description = description;
    this.coverImageUrl = coverImageUrl;
    this.price = price;
    this.availability = availability;
    this.averageRating = averageRating;
    this.tags = tags;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate() {
    if (!this.id) {
      throw new Error("ID is a required field");
    }
    if (!this.title) {
      throw new Error("Title is a required field");
    }
    if (!this.subtitle) {
      throw new Error("Subtitle is a required field.");
    }
    if (!this.author) {
      throw new Error("Author is a required field.");
    }
    if (!this.publisher) {
      throw new Error("Publisher is a required field.");
    }
    if (!this.publicationDate) {
      throw new Error("Publication date is a required field.");
    }
    if (!this.language) {
      throw new Error("Language is a required field.");
    }
    if (!this.genres || !Array.isArray(this.genres)) {
      throw new Error("Genres must be an array.");
    }
    if (this.pages <= 0) {
      throw new Error("Pages must be a positive number.");
    }
    if (!this.format) {
      throw new Error("Format is a required field.");
    }
    if (!this.description) {
      throw new Error("Description is a required field.");
    }
    if (!this.coverImageUrl) {
      throw new Error("Cover image URL is a required field.");
    }
    if (!this.price) {
      throw new Error("Price is a required field.");
    }
    if (!this.availability) {
      throw new Error("Availability is a required field.");
    }
    if (this.averageRating < 0 || this.averageRating > 5) {
      throw new Error("Average rating must be between 0 and 5.");
    }
    if (!this.tags || !Array.isArray(this.tags)) {
      throw new Error("Tags must be an array.");
    }
    if (!this.createdAt) {
      throw new Error("Created at is a required field.");
    }
    if (!this.updatedAt) {
      throw new Error("Updated at is a required field.");
    }
  }
}
export { Book };
