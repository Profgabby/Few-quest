import {z} from "zod";
export const schoolRegistrationSchema=z.object({schoolName:z.string().trim().min(2).max(160),schoolType:z.string().trim().min(2).max(80),state:z.string().trim().min(2).max(80),lga:z.string().trim().min(2).max(100),address:z.string().trim().min(5).max(300),fullName:z.string().trim().min(2).max(120),email:z.string().email(),phone:z.string().trim().min(7).max(30),password:z.string().min(8).max(128),preferredLanguage:z.enum(["en","ha","yo","ig","fr","ar"])});
export type SchoolRegistrationInput=z.infer<typeof schoolRegistrationSchema>;
