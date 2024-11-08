"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { OptionCard } from "@/components/Card";
import { useRouter } from "next/navigation";
import { surveyUtils } from "@/app/utils/survey";

export default function SurveyPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("surveyUserEmail");
    if (!email) {
      router.push("/home");
      return;
    }
    setUserEmail(email);
  }, [router]);

  const handleSubmit = async () => {
    try {
      if (!userEmail || !selectedOption) return;

      await surveyUtils.updateSurveyProgress(userEmail, {
        currentStep: 2,
        shoeChoice: selectedOption,
        updatedAt: new Date().toISOString(),
      });

      router.push("/rating");
    } catch {
      console.log("Error saving survey progress");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <div className="text-center text-white mb-8">
        <h2 className="text-sm font-semibold text-gray-400">QUESTION 1</h2>
        <h1 className="text-2xl font-bold mt-2">
          What is your preferred choice?
        </h1>
      </div>

      <div className="flex w-1/5 gap-8">
        <OptionCard
          label="Nike Black"
          imageSrc="/page2/nike-black.png"
          selected={selectedOption === "black"}
          onSelect={() => setSelectedOption("black")}
        />
        <OptionCard
          label="Nike Orange"
          imageSrc="/page2/nike-orange.png"
          selected={selectedOption === "orange"}
          onSelect={() => setSelectedOption("orange")}
        />
      </div>

      {selectedOption === null && (
        <p className="text-red-500 mt-4">Please select one</p>
      )}

      <div className="flex justify-between w-full max-w-xs mt-8">
        <Button className="bg-pink-500">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          className="bg-lime-500"
          disabled={selectedOption === null}
          onClick={handleSubmit}
        >
          Next
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
