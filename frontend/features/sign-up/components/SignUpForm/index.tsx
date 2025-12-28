import type { FC } from "react";
import BaseButton from "~/components/BaseButton";
import BaseFormInput from "~/components/BaseFormInput";
import { useAuthContext } from "~/contexts/useAuthContext";
import { useSignUp } from "../../hooks/useSignUp";

export const SignUpForm: FC = () => {
  const { csrfToken } = useAuthContext();
  const { userSignUpInputs, setSignUpTextInput, errorMessage, mutate } = useSignUp(csrfToken);

  return (
    <>
      <h3 className='mt-16 w-full text-center text-2xl font-bold'>会員登録フォーム</h3>

      {errorMessage && (
        <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          {errorMessage}
        </div>
      )}

      <div className='mt-8'>
        <BaseFormInput
          id='name'
          label='ユーザ名'
          name='name'
          type='text'
          value={userSignUpInputs.name}
          onChange={setSignUpTextInput}
          validationErrorMessages={[]}
        />
      </div>

      <div className='mt-8'>
        <BaseFormInput
          id='email'
          label='Email'
          name='email'
          type='email'
          value={userSignUpInputs.email}
          onChange={setSignUpTextInput}
          validationErrorMessages={[]}
        />
      </div>

      <div className='mt-8'>
        <BaseFormInput
          id='password'
          label='パスワード'
          name='password'
          type='password'
          value={userSignUpInputs.password}
          onChange={setSignUpTextInput}
          validationErrorMessages={[]}
        />
      </div>

      <div className='w-full flex justify-center'>
        <div className='mt-16'>
          <BaseButton borderColor='border-green-500' bgColor='bg-green-500' label='登録する' onClick={() => mutate()} />
        </div>
      </div>
    </>
  );
};
