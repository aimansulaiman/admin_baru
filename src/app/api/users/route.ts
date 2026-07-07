import { createNewUser, getAllUsers } from "@/app/api/data/users";
import type { User } from "@/types/user";

export async function GET() {
  return Response.json({
    success: true,
    data: getAllUsers(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const newUser = createNewUser({
    name: body.name,
    email: body.email,
    role: body.role || "user",
    status: body.status || "active",
  } satisfies Omit<User, "id">);

  return Response.json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
}