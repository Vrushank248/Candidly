//../../ the name of folder is (auth)
// when we write a folder name in parantheses, it means we are creating a group of folders
'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse";
import {Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 500)
  const router = useRouter()

  // zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({ // the type definition in <> brackets is optional for type safety
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''

    }
  })

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`)

          // console.log(response.data.message)
          // const message = response.data.message // sometimes directly passing value in useState doesn't works. so first we can store it then use
          setUsernameMessage(response.data.message)
        } catch (error) {

          const AxiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            AxiosError.response?.data.message ?? "Error checking username availablity"
          )

        } finally {
          setIsCheckingUsername(false)
        }
      }
    }

    checkUsernameUniqueness()
  }, [username])


  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)

      toast("Success", {
        description: response.data.message
      })

      router.replace(`/verify/${username}`)

      setIsSubmitting(false)

    } catch (error) {
      console.error("Error signing up the user", error)

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage = axiosError.response?.data.message


      toast("Sign-up error", {
        description: errorMessage,
        className: "bg-destructive text-destructive-foreground border-destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5x1 mb-6">
            Join Candidly
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} 
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                    <p className= {`text-sm ${usernameMessage === "This Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                      {usernameMessage}
                    </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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

          <Button type="submit" disabled = {isSubmitting}>
              {
                isSubmitting ? (

                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : ('Signup')
              }
          </Button>
          </form>
        </Form>

        <div className="text-center mt-4">

              <p>
                Already a member?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                  Sign-In
                </Link>
              </p>
        </div>
        
      </div>
    </div>
  )
}

export default Page