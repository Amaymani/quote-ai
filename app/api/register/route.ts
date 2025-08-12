import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/config/mongo';
import User from '@/lib/models/user';

export async function POST(request: Request) {
  try {

    await dbConnect();

    const body = await request.json();
    const { email, password, confirmPassword } = body;

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'A user with this email already exists.' },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const userForResponse = {
      id: savedUser._id,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    return NextResponse.json(
      {
        message: 'User registered successfully.',
        user: userForResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[REGISTRATION_API_ERROR]', error);

    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { message: 'Validation failed.', errors: errorMessages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}