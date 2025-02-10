import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../mutations';

const SearchBooks = () => {
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleSaveBook = async (book) => {
    try {
      const { data } = await saveBook({
        variables: {
          bookId: book.id,
          authors: book.authors,
          description: book.description,
          title: book.title,
          image: book.image,
          link: book.link,
        },
      });
    } catch (error) {
      
    }
  };

  return (
    <div>
      {
    }
    </div>
  );
};
export default SearchBooks;