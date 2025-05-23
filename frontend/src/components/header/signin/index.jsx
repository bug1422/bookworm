import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/context/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { toastSuccess } from '@/components/toast';
import eventBus from '@/lib/eventBus';
import SpinningCircle from '@/components/icons/loading';
const signInSchema = Yup.object({
  email: Yup.string().email('Must be email').required("Can't be empty"),
  password: Yup.string()
    .min(3, 'Must be longer than 3')
    .required("Can't be empty"),
});
const SignInForm = ({ handleSignInSuccess }) => {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [loading, setLoading] = useState();
  const [signinError, setSigninError] = useState(null);
  const form = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signin(data.email, data.password);
      toastSuccess('Signin success');
      handleSignInSuccess();
    } catch (e) {
      setSigninError(e.message);
    }
    setLoading(false);
    //Close popup
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Sign In</DialogTitle>
        <DialogDescription>Enter Your Email & Password</DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="email"
            className="grid gap-4 py-4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    id="email"
                    className="col-span-3"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter your email address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            className="grid gap-4 py-4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    id="password"
                    className="col-span-3"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="flex items-center">
            {signinError != null && (
              <div className="me-auto text-red-600 font-bold italic">
                {signinError}
              </div>
            )}
            <Button type="submit" className="hover:cursor-pointer">
              {loading ? <SpinningCircle /> : <>Submit</>}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </>
  );
};

export const DialogOpenEvent = 'dialogOpen';

export const SignInDialog = ({ isOpen, setIsOpen }) => {
  useEffect(() => {
    const handleDialogOpen = () => {
      setIsOpen(true);
    };
    eventBus.addEventListener(DialogOpenEvent, handleDialogOpen);
    return () => {
      eventBus.removeEventListener(DialogOpenEvent, handleDialogOpen);
    };
  }, []);
  const handleSignInSuccess = () => {
    setIsOpen(false); // Close the dialog after successful sign-in
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <SignInForm handleSignInSuccess={handleSignInSuccess} />
      </DialogContent>
    </Dialog>
  );
};
