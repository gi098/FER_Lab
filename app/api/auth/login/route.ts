import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple mock validation
    if (email && password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Read from JSON file
      let users = [];
      try {
        const fileData = fs.readFileSync(dbPath, "utf-8");
        users = JSON.parse(fileData);
      } catch {
        // file might not exist yet
      }

      const user = users.find((u: { email: string; password: string; name: string }) => u.email === email && u.password === password);

      if (user) {
        return NextResponse.json(
          { message: "Login successful", user: { email: user.email, name: user.name } },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
