import * as z from "zod";

/*

1) name, username, and bio should each have a minimum length of 3 characters.
2) name, username, and bio should each have a maximum length of 30 characters (for name and username) and 1000 characters (for bio).

This schema can be used to validate user data before saving it to a database, processing it in an application, or performing any other data-related operations. Keep in mind that "Zod is a versatile library for data validation and schema creation", and this example demonstrates its usage for a specific use case.

*/

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 caracters." }),
  username: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 caracters." }),
  bio: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(1000, { message: "Maximum 1000 caracters." }),
});
