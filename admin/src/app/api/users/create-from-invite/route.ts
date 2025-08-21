import 'server-only';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "@/server/repositories/prisma-user.repository";

const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);

export async function POST(request: Request) {
  try {
    const { authId, email } = await request.json();

    if (!authId || !email) {
      return NextResponse.json({ error: "Missing authId or email" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await userRepository.findByAuthId(authId);
    
    if (existingUser) {
      return NextResponse.json({ 
        message: "User already exists",
        user: existingUser 
      });
    }

    // Create new user with default role
    const newUser = await userRepository.create({
      authId,
      email,
      role: 'user'
    });

    return NextResponse.json({ 
      message: "User created successfully",
      user: newUser 
    });

  } catch (error) {
    console.error("Error creating user from invitation:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}