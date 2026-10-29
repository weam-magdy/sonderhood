import React from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBlogsStatus } from '../../app/blogs/blogsSlice'
import { selectAllBlogs } from '../../seo/selectors'
import useSeo from '../../seo/useSeo'
import { PAGES, blogSlug, pageLd } from '../../seo/meta.mjs'
import SafeImage from '../SafeImage'

export default function Blogs()
{
    useSeo({ ...PAGES.blog, jsonLd: pageLd({ name: 'Blog', path: PAGES.blog.path }) })

    const blogs = useSelector(selectAllBlogs)
    const blogsStatus = useSelector(selectBlogsStatus)

    const navigate = useNavigate()

    // The articles published from the code are always in the list, so the page
    // renders at once and says below the list whether the rest is still coming.
    const restofBlogs = blogs.slice(1)
    const firstBlog = blogs.slice(0, 1)

    const displayedBlogs = restofBlogs.map(blog =>
        (
            <div key={blog.id} className='TopicMain'>
                <div className='TopicMainImage'>
                    <SafeImage src={blog.image} alt={blog.title} />
                </div>
                <div className='TopicMainInfo'>
                    <div className='TopicMainInfoService'>
                        <div className='TopicMainInfoServiceName'>
                            {blog.topic}
                        </div>
                        <div className='TopicMainInfoServiceTime'>
                            {blog.duration}
                        </div>
                    </div>
                    <h2 className='TopicMainInfoTitle'>
                        <Link className='PlainLink' to={`/blog/${blogSlug(blog)}`}>{blog.title}</Link>
                    </h2>
                    <div className='TopicMainInfoAuthor'>
                        By: {blog.therapist}
                    </div>
                    <div className='TopicMainInfoDesc'>
                        {blog.description}
                    </div>
                    <div className='TopicMainInfoButton'>
                        <button onClick={() => navigate(`/blog/${blogSlug(blog)}`)}>Read more <FontAwesomeIcon style={{width: '7%'}} icon={faChevronRight} /></button>
                    </div>
                </div>
            </div>
        ))

    return (
        <>
        <div className='BlogsPageContainer'>
            <PagesHeader />
            <div className='BlogsPage'>
                <div className='BlogsPageOurBlogs'>
                    <h1 className='AboutPageOurStoryTitle'>
                        OUR BLOG
                    </h1>
                    <div className='AboutPageOurStoryDesc'>
                        <div className='AboutPageDescFirstPart'>
                            Our blog section is a valuable resource for insights into mental health, well-being, and personal growth. Our expert therapists regularly share informative articles, practical tips, and strategies to help you navigate life's challenges.
                        </div>
                        <div className='AboutPageDescSecPart'>
                            Whether you're seeking guidance on managing stress, improving relationships, or enhancing your overall mental health, our blog offers evidence-based information in an accessible and relatable format. Explore a wealth of knowledge, empowering you to lead a happier, healthier life.
                        </div>
                    </div>
                </div>
                <div className='BlogsMain'>
                    <div className='BlogsMainImage'>
                        <SafeImage src={firstBlog[0].image} alt={firstBlog[0].title} loading='eager' />
                    </div>
                    <div className='BlogsMainInfo'>
                        <div className='BlogsMainInfoService'>
                            <div className='BlogsMainInfoServiceName'>
                                {firstBlog[0].topic}
                            </div>
                            <div className='BlogsMainInfoServiceTime'>
                                {firstBlog[0].duration}
                            </div>
                        </div>
                        <h2 className='BlogsMainInfoTitle'>
                            <Link className='PlainLink' to={`/blog/${blogSlug(firstBlog[0])}`}>{firstBlog[0].title}</Link>
                        </h2>
                        <div className='BlogsMainInfoServiceAuthor'>
                            By: {firstBlog[0].therapist}
                        </div>
                        <div className='BlogsMainInfoDesc'>
                            {firstBlog[0].description}
                        </div>
                        <div className='BlogsMainInfoButton'>
                            <button onClick={() => navigate(`/blog/${blogSlug(firstBlog[0])}`)}>READ MORE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='TopicContainer'>
            {displayedBlogs}
            {(blogsStatus === 'idle' || blogsStatus === 'loading') && <p className='SimplePageStatus BlogsStatus'>Loading more articles…</p>}
            {blogsStatus === 'failed' && <p className='SimplePageStatus BlogsStatus'>We couldn't load the other articles. Please refresh the page.</p>}
        </div>
        </>
    )
}
