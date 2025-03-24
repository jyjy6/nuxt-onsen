import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Register from "../models/auth/RegisterModel-forFake";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.DB_URL;

async function seedDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("📡 Connected to MongoDB");

    const fakeUsers = [];

    for (let i = 0; i < 30; i++) {
      fakeUsers.push({
        username: faker.internet.userName(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profileImage: faker.image.avatar(),
        phone: faker.phone.number(),
        address: {
          country: faker.location.country(),
          mainAddress: faker.location.streetAddress(),
          subAddress: faker.location.secondaryAddress(),
        },
        status: "active",
        role: "user",
        lastLogin: faker.date.recent(),
        loginAttempts: faker.number.int({ min: 0, max: 5 }),
        premiumUntil: faker.date.future(),
      });
    }

    await Register.insertMany(fakeUsers);
    console.log("✅ Fake users inserted successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
