import { type FC } from "react";
import BaseButton from "~/components/BaseButton";
import BaseFormInput from "~/components/BaseFormInput";
import { useAuthContext } from "~/contexts/useAuthContext";
import { useSignIn } from "../../hooks/useSignIn";

export const SignInForm: FC = () => {
  const { csrfToken } = useAuthContext();
  const { userSignInInputs, setSignInTextInput, validationError, mutate } = useSignIn(csrfToken);

  return (
    <>
      <h3 className='mt-16 w-full text-center text-2xl font-bold'>ログインフォーム</h3>

      {validationError && (
        <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center'>
          {validationError}
        </div>
      )}

      <div className='mt-8'>
        <BaseFormInput
          id='email'
          label='Email'
          name='email'
          type='email'
          value={userSignInInputs.email}
          onChange={setSignInTextInput}
          validationErrorMessages={[]}
        />
      </div>

      <div className='mt-8'>
        <BaseFormInput
          id='password'
          label='パスワード'
          name='password'
          type='password'
          value={userSignInInputs.password}
          onChange={setSignInTextInput}
          validationErrorMessages={[]}
        />
      </div>

      <div className='w-full flex justify-center'>
        <div className='mt-16'>
          <BaseButton borderColor='border-green-500' bgColor='bg-green-500' label='ログインする' onClick={() => mutate()} />
        </div>
      </div>
    </>
  );
};
