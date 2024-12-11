import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  console.log("MIDD TOKEN : ", token);

  // If no token is present, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let isAdmin;
  try {
    // Decode the JWT to determine the user role
    isAdmin = jwtDecode(token).isAdmin;
    console.log("MIDDLE IsAdmin : ", isAdmin);
  } catch (error) {
    // If token decoding fails, redirect to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Define the paths for user and admin
  const userPath = "/client";
  const adminPath = "/admin";

  const currentPath = request.nextUrl.pathname;

  // Check if the current path is user-related or admin-related
  const isUserPath = currentPath.startsWith(userPath);
  const isAdminPath = currentPath.startsWith(adminPath);

  // If the user is an admin and trying to access user pages
  if (isUserPath && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If the user is not an admin and trying to access admin pages
  if (isAdminPath && !isAdmin) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  // Allow the request to continue if none of the conditions are met
  return NextResponse.next();
}

export const config = {
  // Apply this middleware to the user and admin routes
  matcher: ["/client/:path*", "/admin/:path*"],
};
