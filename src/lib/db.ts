import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const checkSurveyStatus = async (email: string) => {
  const { data, error } = await supabase
    .from("survey_progress")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
};

export const saveSurveyProgress = async (
  email: string,
  progress: string,
  status = "in-progress"
) => {
  const { data, error } = await supabase
    .from("survey_progress")
    .upsert({
      email,
      progress,
      status,
      updated_at: new Date(),
    })
    .single();

  if (error) throw error;
  return data;
};
