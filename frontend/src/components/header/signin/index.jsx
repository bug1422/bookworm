import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { login } from "@/api/get/user";
import { useState } from "react";
import { useAuth } from "@/components/context/useAuthContext";
import { useNavigate } from "react-router-dom";
const signInSchema = Yup.object({
  email: Yup.string().email("Must be email").required("Can't be empty"),
  password: Yup.string()
    .min(3, "Must be longer than 3")
    .required("Can't be empty"),
});
const SignInForm = () => {
  const navigate = useNavigate()
  const { signin } = useAuth();
  const [signinError, setSigninError] = useState(null);
  const form = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    await signin(data.email, data.password)
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
              Submit
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </>
  );
};

const SignInDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="select-none cursor-pointer">Sign In</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
