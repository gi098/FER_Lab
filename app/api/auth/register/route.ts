import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, fullName } = body;

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simple mock validation
        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Read existing users
        let users = [];
        try {
            if (fs.existsSync(dbPath)) {
                const fileData = fs.readFileSync(dbPath, "utf-8");
                users = JSON.parse(fileData);
            }
        } catch (err) {
            // ignore
        }

        // Check if user exists
        if (users.find((u: any) => u.email === email)) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Save new user
        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name: fullName
        };

        users.push(newUser);
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

        return NextResponse.json(
            { message: "Account created successfully" },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
