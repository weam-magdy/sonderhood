import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { selectedBlogs } from '../../app/blogs/blogsSlice'
import { blogSlug } from '../../seo/meta.mjs'
import SafeImage from '../SafeImage'

export default function OurBlog()
{
    const blogs = useSelector(selectedBlogs)

    const navigate = useNavigate()

    const displayedBlogs = blogs.map(blog =>
        (
            <Link to={`/blog/${blogSlug(blog)}`} key={blog.id} className='OurBlogItemContainer'>
                <div className='OurBlogItemImage'>
                    <SafeImage src={blog.image} alt={blog.title} />
                </div>
                <div className='OurBlogItemInfo'>
                    <div className='OurBlogItemTitle'>
                        {blog.title}
                    </div>
                    <div className='OurBlogItemAuthor'>
                        By: {blog.therapist}
                    </div>
                    <div className='OurBlogItemBody'>
                        {blog.description}
                    </div>
                </div>
            </Link>
        ))

    return (
        <div className='OurBlogContainer'>
            <div className='OurBlogHeader'>
                <h1>OUR BLOG</h1>
            </div>
            <div className='OurBlogItems'>
                {displayedBlogs}
            </div>
            <div className='OurBlogItemsButtons'>
                <button onClick={() => navigate('/blog')} className='OurBlogItemBookButton'>SEE ALL BLOGS</button>
                {/* <button onClick={() => navigate('/ContactUs')} className='OurBlogItemContactButton'>CONTACT US</button> */}
            </div>
        </div>
    )
}
