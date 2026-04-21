"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }

    const { id, firstName, lastName, imageUrl, emailAddresses } = user;

    const newUser = await db.user.upsert({
      where: {
        clerkId: id,
      },
      update: {
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email: emailAddresses[0]?.emailAddress || "",
      },
      create: {
        clerkId: id,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email: emailAddresses[0]?.emailAddress || "",
      },
    });

    return {
      success: true,
      user: newUser,
      message: "User onBoarded Successfully",
    };
  } catch (error) {
    console.error("❌ Error onboarding user:", error);
    return {
      success: false,
      error: "Failed to onboard user",
    };
  }
};

export const currentUserRole = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;

    let userRole = await db.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true },
    });

    if (!userRole) {
      const { id, firstName, lastName, imageUrl, emailAddresses } = user;
      const created = await db.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          firstName: firstName || null,
          lastName: lastName || null,
          imageUrl: imageUrl || null,
          email: emailAddresses[0]?.emailAddress || "",
        },
        select: { role: true },
      });
      userRole = created;
    }

    return userRole.role;
  } catch (error) {
    console.error("❌ Error fetching user role:", error);
    return null;
  }
};

export const getCurrentUser = async () => {
  const user = await currentUser();

  const dbUser = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  });

  return dbUser;
};