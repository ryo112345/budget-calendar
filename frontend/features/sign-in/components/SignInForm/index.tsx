import { Link } from "react-router";
import BaseButton from "~/components/BaseButton";
import BaseFormInput from "~/components/BaseFormInput";
import { useSignIn } from "../../hooks/useSignIn";

export function SignInForm() {
  const { userSignInInputs, setSignInTextInput, errorMessage, fieldErrors, mutate } = useSignIn();

  return (
    <div className='mx-auto max-w-md px-4 mt-16'>
      <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-md'>
        <h3 className='w-full text-center text-2xl font-bold'>ログインフォーム</h3>

        {errorMessage && (
          <div className='w-full pt-5 text-center'>
            <p className='text-red-400'>{errorMessage}</p>
          </div>
        )}

        <div className='mt-4'>
          <BaseFormInput
            id='email'
            label='Email'
            name='email'
            type='email'
            value={userSignInInputs.email}
            onChange={setSignInTextInput}
            validationErrorMessages={fieldErrors.email ? [fieldErrors.email] : []}
          />
        </div>

        <div className='mt-4'>
          <BaseFormInput
            id='password'
            label='パスワード'
            name='password'
            type='password'
            value={userSignInInputs.password}
            onChange={setSignInTextInput}
            validationErrorMessages={fieldErrors.password ? [fieldErrors.password] : []}
          />
        </div>

        <div className='w-full flex justify-center mt-6'>
          <BaseButton borderColor='border-green-500' bgColor='bg-green-500' label='ログインする' onClick={() => mutate()} />
        </div>

        <p className='mt-5 text-center'>
          アカウントをお持ちでないですか？{" "}
          <Link to='/sign_up' className='font-medium text-blue-600 hover:underline'>
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
