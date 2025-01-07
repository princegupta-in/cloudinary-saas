import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json({ videos });
    } catch (error) {
        return NextResponse.json({ msg: "error", error })
    } finally {
        await prisma.$disconnect()
    }
}