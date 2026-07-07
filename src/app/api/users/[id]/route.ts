import { deleteUserById, updateUserById } from "@/app/api/data/users";
import type { User } from "@/types/user";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const updatedUser = updateUserById(
    id,
    {
      name: body.name,
      email: body.email,
     
    } as any ,
  );

  return Response.json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const deletedUser = deleteUserById(id);

  return Response.json({
    success: true,
    message: "User deleted successfully",
    data: deletedUser,
  });
}