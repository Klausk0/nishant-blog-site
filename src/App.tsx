import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  type Post = {
    id: number;
    author: string;
    title: string;
    content: string;
  };

  const [posts, setPosts] = useState<Post[]>([]);

  // ADMIN PASSWORD
  const adminPassword = "nishant123";

  // LOAD POSTS
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setPosts(data || []);
  };

  // LOAD ON START
  useEffect(() => {
    const loadPosts = async () => {
      await fetchPosts();
    };

    loadPosts();
  }, []);

  // CREATE POST
  const handlePost = async () => {
    if (!author || !title || !content) {
      alert("Fill all fields");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        author,
        title,
        content,
      },
    ]);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    // REFRESH POSTS
    fetchPosts();

    // CLEAR INPUTS
    setAuthor("");
    setTitle("");
    setContent("");
  };

  // DELETE POST
  const handleDelete = async (postId: number) => {
    const enteredPassword = window.prompt("Enter admin password");

    // USER CANCELLED
    if (enteredPassword === null) {
      return;
    }

    // WRONG PASSWORD
    if (enteredPassword !== adminPassword) {
      alert("Wrong password");
      return;
    }

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    fetchPosts();
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#f3f4f6" }}>
      <div className="container">
        {/* MAIN BOX */}
        <div
          className="bg-white shadow-sm rounded-4 p-5 mx-auto"
          style={{ maxWidth: "760px" }}
        >
          {/* HERO */}
          <div className="text-center mb-5">
            <h1 className="display-3 fw-bold">My Blog Site</h1>

            <p className="text-muted fs-5 mt-3">Write something .</p>
          </div>

          {/* FORM */}
          <div className="card border-0 bg-light rounded-4 p-4 mb-5">
            <h2 className="fw-bold mb-4">Create a Post</h2>

            <input
              type="text"
              className="form-control form-control-lg mb-3"
              placeholder="Your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <input
              type="text"
              className="form-control form-control-lg mb-3"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="form-control mb-4"
              rows={5}
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <button
              className="btn btn-dark w-100 py-3 rounded-3"
              onClick={handlePost}
            >
              Post
            </button>
          </div>

          {/* POSTS */}
          <div className="d-flex flex-column gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="card border-0 shadow-sm rounded-4 p-4"
              >
                <h3 className="fw-bold mb-1">{post.title}</h3>

                <p className="text-muted small mb-3">by {post.author}</p>

                <p className="mb-0">{post.content}</p>

                {/* DELETE BUTTON */}
                <div className="d-flex justify-content-end mt-4">
                  <button
                    className="btn btn-sm btn-light text-muted border"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
