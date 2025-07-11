import { BlogCard } from "../components/BlogCard";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";

export const Blogs = () =>{
    const {loading, blogs} = useBlogs();

    if(loading){
        return <div>Loading...</div>
    }
    return <div>
    <Appbar/>
    <div className="flex justify-center">
        <div className = "max-w-xl">
            {blogs.map((blog) => (
                <BlogCard 
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={"11th July 2025"}
                id={blog.id}
            />
            ))}
        </div>
        </div>
    </div>
}