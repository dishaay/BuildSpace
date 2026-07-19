import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { getPostById } from "../services/postService";

export default function PostDetailsPage() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await getPostById(id);

                setPost(res.data.post);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <AppShell>
                <div className="max-w-3xl mx-auto">
                    <p>Loading...</p>
                </div>
            </AppShell>
        );
    }

    if (!post) {
        return (
            <AppShell>
                <div className="max-w-3xl mx-auto">
                    <p>Post not found.</p>
                </div>
            </AppShell>
        );
    }
console.log(post);
console.log(post.image);
console.log(`${BACKEND_URL}${post.image}`);
console.log(post.images[0]);
    return (
        <AppShell>
            <div className="max-w-3xl mx-auto">
                <div className="border border-border rounded-xl p-6 bg-bg-surface">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-ink">
                            Post
                        </h1>

                        <p className="text-sm text-ink-faint mt-2">
                            By{" "}
                            {post.author?.name ||
                                post.author?.username}
                        </p>
                    </div>

                    <p className="text-base text-ink whitespace-pre-wrap">
                        {post.content}
                    </p>

                    {post.images?.length > 0 && (
    <img
src={`${BACKEND_URL}${post.images[0]}`}
        className="mt-6 rounded-xl w-full max-h-[500px] object-cover border border-border"
    />
)}

                    <div className="mt-6 text-xs text-ink-faint">
                        Posted on{" "}
                        {new Date(
                            post.createdAt
                        ).toLocaleString()}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}