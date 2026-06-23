export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { listProjectApiKeys, listUserProjects } from "@relog/db";
import { CreateKeyForm } from "./create-form";

export default async function ApiKeysPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const projects = await listUserProjects(userId);
  const projectsWithKeys = await Promise.all(
    projects.map(async (project) => ({
      project,
      keys: await listProjectApiKeys(project.id),
    })),
  );

  return (
    <div style={{ fontFamily: "monospace", padding: "2rem", maxWidth: "800px" }}>
      <h1>API Keys</h1>

      <h2>Create project &amp; key</h2>
      <CreateKeyForm />

      <h2>Existing projects &amp; keys</h2>
      {projectsWithKeys.length === 0 && <p>No projects yet.</p>}
      {projectsWithKeys.map(({ project, keys }) => (
        <div
          key={project.id}
          style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}
        >
          <h3 style={{ margin: "0 0 0.5rem" }}>{project.name}</h3>
          {keys.length === 0 && <p style={{ color: "#888" }}>No keys.</p>}
          {keys.length > 0 && (
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ccc",
                      padding: "0.25rem 0.5rem",
                    }}
                  >
                    Label
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ccc",
                      padding: "0.25rem 0.5rem",
                    }}
                  >
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id}>
                    <td style={{ padding: "0.25rem 0.5rem" }}>{key.label ?? "—"}</td>
                    <td style={{ padding: "0.25rem 0.5rem" }}>{key.createdAt.toISOString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
