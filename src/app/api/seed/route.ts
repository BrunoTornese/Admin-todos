import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      password: bcrypt.hashSync("123456", 10),
      roles: ["Admin"],
      todos: {
        create: [
          {
            description: "Piedra del poder",
          },
          {
            description: "Piedra del tiempo",
          },
          {
            description: "Piedra del destino",
          },
          {
            description: "Piedra del amor",
          },
          {
            description: "Piedra del cielo",
          },
        ],
      },
    },
  });

  return NextResponse.json({ message: "Seed Executed" });
}
