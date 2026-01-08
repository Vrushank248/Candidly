'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {

  const router = useRouter()

  // zod implementation

  const form = useForm<z.infer<typeof signInSchema>>({ // the type definition in <> brackets is optional for type safety
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {

    // we defined the sign- in schema using the NextAuth
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    if (result?.error) {

      if (result.error == 'CredentialsSignin') {
        toast("Login failed", {
          description: "Incorrect identifier or password",
          className: "bg-destructive text-destructive-foreground border-destructive",
        })
      }else{
        toast("Error", {
          description: result.error,
          className: "bg-destructive text-destructive-foreground border-destructive",
        })
      }

    }

    // if the request is successfully passed, then we get a url as a response

    if (result?.url) {
      router.replace('/dashboard')
    }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5x1 mb-6">
            Candidly share your thoughts !
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email / Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">

          <p>
            New to Candidly ?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign-up here
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Page