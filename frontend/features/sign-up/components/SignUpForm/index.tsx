import { Link } from "react-router";
import BaseButton from "~/components/BaseButton";
import BaseFormInput from "~/components/BaseFormInput";
import { useSignUp } from "../../hooks/useSignUp";

export function SignUpForm() {
  const { userSignUpInputs, setSignUpTextInput, errorMessage, fieldErrors, mutate } = useSignUp();

  return (
    <div className='mx-auto max-w-md px-4 mt-16'>
      <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-md'>
        <h3 className='w-full text-center text-2xl font-bold'>会員登録フォーム</h3>

        {errorMessage && (
          <div className='w-full pt-5 text-center'>
            <p className='text-red-400'>{errorMessage}</p>
          </div>
        )}

        <div className='mt-4'>
          <BaseFormInput
            id='name'
            label='ユーザ名'
            name='name'
            type='text'
            value={userSignUpInputs.name}
            onChange={setSignUpTextInput}
            validationErrorMessages={fieldErrors.name ? [fieldErrors.name] : []}
          />
        </div>

        <div className='mt-4'>
          <BaseFormInput
            id='email'
            label='Email'
            name='email'
            type='email'
            value={userSignUpInputs.email}
            onChange={setSignUpTextInput}
            validationErrorMessages={fieldErrors.email ? [fieldErrors.email] : []}
          />
        </div>

        <div className='mt-4'>
          <BaseFormInput
            id='password'
            label='パスワード'
            name='password'
            type='password'
            value={userSignUpInputs.password}
            onChange={setSignUpTextInput}
            validationErrorMessages={fieldErrors.password ? [fieldErrors.password] : []}
          />
        </div>

        <div className='w-full flex justify-center mt-6'>
          <BaseButton borderColor='border-green-500' bgColor='bg-green-500' label='登録する' onClick={() => mutate()} />
        </div>

        <p className='mt-5 text-center'>
          すでにアカウントをお持ちですか？{" "}
          <Link to='/sign_in' className='font-medium text-blue-600 hover:underline'>
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
