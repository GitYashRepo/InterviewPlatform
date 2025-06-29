"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/componants/ui/button"
import {Form} from "@/componants/ui/form"
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";

const AuthFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3, "Username is required") : z.string().optional(),
        email: z.string().email("Invalid email address").min(1, "Email is required"),
        password: z.string().min(4, "Password must be at least 6 characters"),
    });
}

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const formSchema = AuthFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if(type === "sign-up") {
            const {name, email, password} = values;
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const result = await signUp({uid: userCredentials.user.uid, name: name!, email, password});
            if(!result?.success){
                toast.error(result.message);
                return;
            }

            toast.success("Signed Up successfully , Please Sign In!");
            router.push("/sign-in");
        } else {
            const {email, password} = values;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            if(!idToken){
                toast.error("Failed to sign in");
                return;
            }
            await signIn({
                email,
                idToken
            })
            toast.success("Signed in successfully!");
            router.push("/");
        }
    } catch (error) {
        console.log(error);
        toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src='/logo.svg' alt='logo' width={38} height={32} />
                <h2 className="text-primary-100">PrepInterview</h2>
            </div>
            <h3>Practice Job Interview with AI</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full mt-4 form">
                  {!isSignIn && (
                    <FormField
                        control={form.control}
                        name="name"
                        label="Username"
                        placeholder="Enter your username"
                     />
                    )}
                  <FormField
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                  />
                  <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                  />
                  <Button className="btn" type="submit">{isSignIn ? "Sign In" : "Create an Account"}</Button>
                </form>
            </Form>

            <p className="text-center">
                {isSignIn ? 'No account yet?' : 'Already have an account?'}{' '}
                <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="font-bold text-user-primary ml-1">
                    {!isSignIn ? 'Sign In' : 'Sign Up'}
                </Link>
            </p>
        </div>
    </div>
  )
}

export default AuthForm
