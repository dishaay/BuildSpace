import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getUsers } from "../services/userService";
import AppShell from "../components/layout/AppShell";

import { getProjects } from "../services/projectService";
import { getHackathons } from "../services/hackathonService";
import { getPosts } from "../services/postService";

export default function SearchPage() {
    const [searchParams] = useSearchParams();

    const query =
        searchParams.get("q")?.toLowerCase() || "";

    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);
 useEffect(() => {
    async function fetchResults() {
        try {
            setLoading(true);

            const [
                projectRes,
                hackathonRes,
                postRes,
                userRes,
            ] = await Promise.all([
                getProjects(),
                getHackathons(),
                getPosts(),
                getUsers(),
            ]);

            const filteredProjects =
                (projectRes.data.projects || []).filter(
                    (project) =>
                        project.title
                            ?.toLowerCase()
                            .includes(query) ||
                        project.description
                            ?.toLowerCase()
                            .includes(query)
                );

            const filteredHackathons =
                (hackathonRes.data.hackathons || []).filter(
                    (hackathon) =>
                        hackathon.title
                            ?.toLowerCase()
                            .includes(query) ||
                        hackathon.description
                            ?.toLowerCase()
                            .includes(query)
                );

            const filteredPosts =
                (postRes.data.posts || []).filter(
                    (post) =>
                        post.content
                            ?.toLowerCase()
                            .includes(query)
                );

            const filteredUsers =
                (userRes.data.users || []).filter(
                    (user) =>
                        user.name
                            ?.toLowerCase()
                            .includes(query) ||
                        user.username
                            ?.toLowerCase()
                            .includes(query) ||
                        user.bio
                            ?.toLowerCase()
                            .includes(query)
                );

            setProjects(filteredProjects);
            setHackathons(filteredHackathons);
            setPosts(filteredPosts);
            setUsers(filteredUsers);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    fetchResults();
}, [query]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Search Results
        </h1>

        <p className="text-ink-muted mb-8">
          You searched for:
        </p>

        <h2 className="text-accent-violet text-xl mb-8">
          "{query}"
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>

<div className="mb-10">
  <h2 className="text-xl font-semibold mb-4">
    Users ({users.length})
  </h2>

  {users.length === 0 ? (
    <p>No users found.</p>
  ) : (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
  <Link
    key={user._id}
    to={`/profile/${user._id}`}
  >
    <div className="border border-border rounded-xl p-4 hover:border-accent-violet transition">
      <h3 className="font-semibold">
        {user.name}
      </h3>

      <p className="text-sm text-ink-faint">
        @{user.username}
      </p>

      <p className="text-sm text-ink-muted mt-2">
        {user.bio}
      </p>
    </div>
  </Link>
))}
    </div>
  )}
</div>
            {/* PROJECTS */}

            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Projects ({projects.length})
              </h2>

              {projects.length === 0 ? (
                <p>No projects found.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}`}
                    >
                      <div className="border border-border rounded-xl p-4 hover:border-accent-violet transition">
                        <h3 className="font-semibold">
                          {project.title}
                        </h3>

                        <p className="text-sm text-ink-muted mt-2">
                          {project.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* HACKATHONS */}

            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Hackathons ({hackathons.length})
              </h2>

              {hackathons.length === 0 ? (
                <p>No hackathons found.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {hackathons.map((hackathon) => (
                    <Link
                      key={hackathon._id}
                      to={`/hackathons/${hackathon._id}`}
                    >
                      <div className="border border-border rounded-xl p-4 hover:border-accent-violet transition">
                        <h3 className="font-semibold">
                          {hackathon.title}
                        </h3>

                        <p className="text-sm text-ink-muted mt-2">
                          {hackathon.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* POSTS */}

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Posts ({posts.length})
              </h2>

              {posts.length === 0 ? (
                <p>No posts found.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {posts.map((post) => (
  <Link
    key={post._id}
    to={`/posts/${post._id}`}
  >
    <div className="border border-border rounded-xl p-4 hover:border-accent-violet transition">
      <p>{post.content}</p>

      <p className="text-xs text-ink-faint mt-3">
        By{" "}
        {post.author?.username ||
          post.author?.name}
      </p>
    </div>
  </Link>
))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}