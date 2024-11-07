"use client";

import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card2";
import { Label } from "@/components/Label";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { surveyUtils } from "@/app/utils/survey";

const Rating = () => {
  const [ratings, setRatings] = useState({
    comfort: 0,
    looks: 0,
    price: 0,
  });

  const [errors, setErrors] = useState({
    comfort: false,
    looks: false,
    price: false,
  });

  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("surveyUserEmail");
    if (!email) {
      router.push("/home");
      return;
    }
    setUserEmail(email);

    const fetchPreviousRatings = async () => {
      try {
        const previousData = await surveyUtils.getPreviousSurvey(email);
        if (previousData?.ratings) {
          setRatings(previousData.ratings);
        }
      } catch {
        console.log("Error fetching previous ratings");
      }
    };

    fetchPreviousRatings();
  }, [router]);

  const handleRatingChange = (aspect: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [aspect]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [aspect]: false,
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      comfort: ratings.comfort === 0,
      looks: ratings.looks === 0,
      price: ratings.price === 0,
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      try {
        if (!userEmail) return;

        await surveyUtils.completeSurvey(userEmail, {
          ratings,
          completedAt: new Date().toISOString(),
        });

        router.push("/exit");
      } catch (error) {
        console.log("Error completing survey:", error);
      }
    }
  };

  const handleBack = () => {
    console.log("Going back");
    router.push("/survey");
  };

  const aspects = [
    { key: "comfort" as const, label: "Comfort" },
    { key: "looks" as const, label: "Looks" },
    { key: "price" as const, label: "Price" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-gradient-to-l from-black to-gray-800 p-6">
      <div className="text-center text-white mb-8">
        <h2 className="text-sm font-semibold text-gray-400"> QUESTION 2</h2>
        <h1 className="text-2xl font-bold mt-2">
          How important are these aspects for you?
        </h1>
      </div>

      <Card className="w-full max-w-lg mx-auto border-none items-center">
        <CardContent className="space-y-6">
          {aspects.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center h-14 justify-between bg-white rounded-full px-4 py-2">
                <Label className="text-black text-lg font-bold">{label}</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleRatingChange(key, value)}
                      className={`w-4 h-4 rounded-full transition-colors ${
                        value <= ratings[key]
                          ? "bg-black"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      aria-label={`Rate ${label} ${value} out of 5`}
                    />
                  ))}
                </div>
              </div>
              {errors[key] && (
                <p className="text-red-500 text-sm px-4">
                  Please select a score
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <Button onClick={handleBack} className="bg-pink-500">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-white hover:bg-gray-100 text-black"
            >
              Send
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rating;
