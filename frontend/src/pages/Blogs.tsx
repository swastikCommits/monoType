import { BlogCard } from "../components/BlogCard";

export const Blogs = () =>{
    return <div className="flex justify-center">
        <div className = "max-w-xl">
            <BlogCard 
            authorName="John Doe"
            title="My Blog"
            content="This is my blog"
            publishedDate="2021-01-01"
            id={1}
            />
            <BlogCard 
            authorName="John Doe"
            title="My Blog"
            content="This is my blog"
            publishedDate="2021-01-01"
            id={1}
            />
            <BlogCard 
            authorName="John Doe"
            title="My Blog"
            content="This is my blog"
            publishedDate="2021-01-01"
            id={1}
            />
        </div>
        
    </div>
}