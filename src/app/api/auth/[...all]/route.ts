export async function GET() {
  return Response.json({
    success: true,
    message: "Auth API disabled. Dummy auth is enabled.",
  });
}

export async function POST() {
  return Response.json({
    success: true,
    message: "Auth API disabled. Dummy auth is enabled.",
  });
}