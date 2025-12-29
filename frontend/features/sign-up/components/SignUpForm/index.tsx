import type { FC } from "react";
import { Link } from "react-router";
import { Lock, Mail, User, UserPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PasswordInput } from "~/components/ui/password-input";
import { useAuthContext } from "~/contexts/useAuthContext";
import { useSignUp } from "../../hooks/useSignUp";

export const SignUpForm: FC = () => {
  const { csrfToken } = useAuthContext();
  const { userSignUpInputs, setSignUpTextInput, errorMessage, fieldErrors, mutate } = useSignUp(csrfToken);

  return (
    <div className='flex min-h-[calc(100vh-80px)] items-start justify-center px-4 pt-36'>
      <Card className='w-full max-w-lg shadow-lg gap-0'>
        <CardHeader className='text-center pt-2 pb-6 justify-items-center'>
          <CardTitle className='text-3xl'>会員登録</CardTitle>
          <CardDescription className='text-base'>アカウントを作成してサービスを利用しましょう</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className='mb-6 flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-base text-destructive'>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-base'>
                ユーザー名
              </Label>
              <div className='relative'>
                <User className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
                <Input
                  id='name'
                  name='name'
                  type='text'
                  placeholder='山田太郎'
                  className={`h-12 pl-12 text-base ${fieldErrors.name ? "border-destructive" : ""}`}
                  value={userSignUpInputs.name}
                  onChange={setSignUpTextInput}
                />
              </div>
              {fieldErrors.name && <p className='text-sm text-destructive'>{fieldErrors.name}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email' className='text-base'>
                メールアドレス
              </Label>
              <div className='relative'>
                <Mail className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='example@email.com'
                  className={`h-12 pl-12 text-base ${fieldErrors.email ? "border-destructive" : ""}`}
                  value={userSignUpInputs.email}
                  onChange={setSignUpTextInput}
                />
              </div>
              {fieldErrors.email && <p className='text-sm text-destructive'>{fieldErrors.email}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='text-base'>
                パスワード
              </Label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
                <PasswordInput
                  id='password'
                  name='password'
                  placeholder='••••••••'
                  className={`h-12 pl-12 text-base ${fieldErrors.password ? "border-destructive" : ""}`}
                  value={userSignUpInputs.password}
                  onChange={setSignUpTextInput}
                />
              </div>
              {fieldErrors.password && <p className='text-sm text-destructive'>{fieldErrors.password}</p>}
            </div>

            <Button className='w-full gap-2 bg-black text-white hover:bg-gray-800 h-12 text-base' size='lg' onClick={() => mutate()}>
              <UserPlus className='h-5 w-5' />
              登録する
            </Button>

            <p className='text-center text-base text-muted-foreground'>
              すでにアカウントをお持ちですか？{" "}
              <Link to='/sign_in' className='font-medium text-primary underline-offset-4 hover:underline'>
                ログイン
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
