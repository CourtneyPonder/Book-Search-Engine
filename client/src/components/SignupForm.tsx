import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../mutations';

const SignupForm = () => {
  const [loginUser] = useMutation(LOGIN_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target;
    try {
      const { data } = await loginUser({ variables: { email: email.value, password: password.value } });
     
    } catch (error) {
     
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {
    }
    </form>
  );
};

export default SignupForm;
