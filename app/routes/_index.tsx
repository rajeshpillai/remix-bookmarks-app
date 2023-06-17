import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
// import { PrismaClient, User } from "@prisma/client";
import { db } from "~/utils/db.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export async function loader() {
  const allUsers = await db.user.findMany();
  console.log("users(loader): ", allUsers);
  await db.$disconnect();
  return allUsers;
}

export async function action({ request }) {
  const form = await request.formData();


  console.log("POST DATA: ", form.get("email"), form.get("username"));
  
  let allUsers;
  try {
    allUsers = await db.user.create({
      data: { email: form.get("email"), username: form.get("username") },
    });
  }catch(ex) {
    console.log("Error: ", ex);
  }

  console.log("users(action): ", allUsers);
  await db.$disconnect();
  return true;
}

export default function Index() {
  const users = useLoaderData();
  const { state } = useTransition();
  const busy = state === "submitting";

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        width: 600,
        margin: "auto",
      }}
    >
      <h2>Users and Bookmarks: Sample App</h2>
      <h4>Remix with Prisma and SQLite</h4>
      <Form method="post">
        <div>
          <input name="email" placeholder="Email" size={30} />
        </div>
        <div>
          <input name="username" placeholder="User Name" size={30} />
        </div>
        <button type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create New User"}
        </button>
      </Form>

      {users.map((user) => (
        <div key={user.id} style={{ border: "1px solid grey", padding: 6, margin: 8 }}>
          <div>{user.username}</div>
          <div>{user.email}</div>
          <div>
            <Link to={`/bookmarks/${user.id}`}>
              <button>View Details</button>
            </Link>
          </div>

        </div>
      ))}
    </div>
  );
}