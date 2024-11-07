"use client";
import React, { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formSchema = z.object({
  email: z.string().email(),
});

export default function Page1() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const { data: surveyData, error: surveyError } = await supabase
        .from("survey_progress")
        .select("*")
        .eq("email", values.email)
        .single();

      if (surveyError && surveyError.code !== "PGRST116") {
        throw surveyError;
      }

      if (surveyData) {
        if (surveyData.status === "completed") {
          router.push("/exit");
          return;
        }

        router.push(`/survey`);
        return;
      }

      const { error: createError } = await supabase
        .from("survey_progress")
        .insert([
          {
            email: values.email,
            status: "in-progress",
            progress: {
              currentStep: 1,
              startedAt: new Date().toISOString(),
            },
          },
        ]);

      if (createError) throw createError;

      localStorage.setItem("surveyUserEmail", values.email);

      router.push("/survey");
    } catch {
      console.error("Error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center h-full text-white bg-gradient-to-l from-black to-gray-800">
      <div className="relative">
        <div
          className="absolute inset-0 left-44 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/home/bg.png')",
            width: 350,
            height: 350,
          }}
        ></div>
        <Image
          className="relative z-10 left-44 inset-10 drop-shadow-2xl opacity-80"
          src="/home/front.png"
          alt="front"
          width={500}
          height={300}
          priority
        />
      </div>
      <div className="w-3/4 p-14">
        <h1 className="text-6xl font-bold mb-4 text-center lg:text-left">
          Questionnaire
        </h1>
        <div className="bg-pink-200 p-12 rounded-[40px] mb-6 text-gray-900">
          <h2 className="text-lg font-semibold mb-2">Welcome!</h2>
          <p className="text-sm">
            We&apos;re excited to hear your thoughts, ideas, and insights.
            Don&apos;t worry about right or wrong answers—just speak from the
            heart. Your genuine feedback is invaluable to us!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      {...field}
                      className="text-black"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full font-black h-14"
              disabled={isLoading}
            >
              {isLoading ? (
                "Checking..."
              ) : (
                <>
                  Start Survey
                  <span className="ml-2">→</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
