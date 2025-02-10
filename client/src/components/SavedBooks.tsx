import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../queries';
import { REMOVE_BOOK } from '../mutations';

const SavedBooks = () => {
  const { data, loading, error } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({ variables: { bookId } });
      
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
export default SavedBooks;
