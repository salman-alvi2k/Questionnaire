import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const surveyUtils = {
  async getSurveyProgress(email: string) {
    const { data, error } = await supabase
      .from("survey_progress")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    return data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateSurveyProgress(email: string, progress: any) {
    const { error } = await supabase
      .from("survey_progress")
      .update({
        progress: {
          ...progress,
          updatedAt: new Date().toISOString(),
        },
      })
      .eq("email", email);

    if (error) throw error;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async completeSurvey(email: string, finalData: any) {
    const { error } = await supabase
      .from("survey_progress")
      .update({
        status: "completed",
        progress: {
          ...finalData,
          completedAt: new Date().toISOString(),
        },
      })
      .eq("email", email);

    if (error) throw error;
  },

  getPreviousSurvey: async (email: string) => {
    try {
      const response = await fetch(`/api/surveys/${email}`); // Adjust endpoint as needed
      if (!response.ok) throw new Error("Failed to fetch previous survey");
      return await response.json();
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  },
};

export default surveyUtils;
