import { authMiddleware } from "@clerk/nextjs";

/* Routes groups are useful for -> 
1) Organizing routes into groups e.g., by site section, intent or team.
2) Enabling nested layouts in the same route segment level.
*/

export default authMiddleware({

    // An array of public routes that don't require authentication.
  publicRoutes: ["/" ,"/api/webhook/clerk", "/api/uploadthing"],

  // An array of routes to be ignored by the authentication middleware.
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
