"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

const Exit = () => {
  const router = useRouter();

  React.useEffect(() => {
    // You can access the feedback data from localStorage or state management
    const saveFeedback = async () => {
      const rating = localStorage.getItem("rating");
      const feedback = localStorage.getItem("feedback");

      if (rating && feedback) {
        try {
          const response = await fetch("/api/feedback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating, feedback }),
          });

          if (!response.ok) {
            throw new Error("Failed to save feedback");
          }

          // Clear the stored feedback
          localStorage.removeItem("rating");
          localStorage.removeItem("feedback");
        } catch (error) {
          console.log("Error saving feedback:", error);
        }
      }
    };

    saveFeedback();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center h-screen text-white bg-gradient-to-l from-black to-gray-800">
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
      <div className="flex flex-col w-3/4 p-14">
        <div>
          <h1 className="text-6xl font-bold text-left">Thank You</h1>
        </div>
        <div className="ml-auto self-end">
          <h2 className="text-2xl font-semibold mr-20">for your feedback!</h2>
        </div>
        <div className="flex justify-between w-full max-w-xs mt-8">
          <Button
            variant="secondary"
            className="bg-pink-500"
            onClick={() => router.push("/rating")}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button className="bg-white" onClick={() => router.push("/home")}>
            Back to Home
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Exit;
