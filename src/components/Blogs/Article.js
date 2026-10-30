import React from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { selectBlogsStatus } from '../../app/blogs/blogsSlice'
import { selectAllBlogs } from '../../seo/selectors'
import { selectedTherapists } from '../../app/therapists/therapistsSlice'
import useSeo from '../../seo/useSeo'
import { blogLd, blogMeta, blogServiceLink, blogSlug, findTherapistByName, legacySlug, longDate, relatedBlogs, therapistSlug } from '../../seo/meta.mjs'
import SafeImage from '../SafeImage'
import NotFound, { PageError, PageLoading } from '../PageStatus'

export default function Article()
{
    const blogs = useSelector(selectAllBlogs)
    const blogsStatus = useSelector(selectBlogsStatus)
    const therapists = useSelector(selectedTherapists)

    // /blog/:slug, or an old /ArticlePage/:title link (the title with its spaces removed)
    const { slug, title } = useParams()

    const navigate = useNavigate()

    const selectedBlog = slug ? blogs.find(blog => blogSlug(blog) === slug.toLowerCase()) : undefined
    const movedBlog = title ? blogs.find(blog => legacySlug(blog.title) === legacySlug(title)) : undefined
    const author = selectedBlog ? findTherapistByName(therapists, selectedBlog.therapist) : undefined

    useSeo(selectedBlog ? { ...blogMeta(selectedBlog), jsonLd: blogLd(selectedBlog, author) } : {})

    if (movedBlog) return <Navigate to={`/blog/${blogSlug(movedBlog)}`} replace />
    if (!selectedBlog)
    {
        if (blogsStatus === 'failed') return <PageError />
        if (blogsStatus === 'succeeded') return <NotFound />
        return <PageLoading />
    }

    const readMoreBlogs = relatedBlogs(blogs, selectedBlog)
    const service = blogServiceLink(selectedBlog)

    const displayedSelectedBlog = (
        <div className='ArticlePageMain'>
            <div className='ArticlePageMainImage'>
                <SafeImage src={selectedBlog.image} alt={selectedBlog.title} loading='eager' />
            </div>
            <div className='ArticlePageMainInfo'>
                <div className='ArticlePageMainInfoService'>
                    <div className='ArticleMainInfoServiceName'>
                        {selectedBlog.topic}
                    </div>
                    <div className='ArticleMainInfoServiceTime'>
                        {selectedBlog.duration}
                    </div>
                </div>
                <h1 className='ArticleMainInfoTitle'>
                    {selectedBlog.title}
                </h1>
                <div className='ArticlePageMainInfoServiceAuthor'>
                    By: {author ? <Link className='PlainLink' to={`/therapists/${therapistSlug(author)}`}>{author.name}</Link> : selectedBlog.therapist}
                </div>
                {selectedBlog.createTime && <div className='ArticlePublished'>Published {longDate(selectedBlog.createTime)}</div>}
            </div>
        </div>
    )

    const displayedReadMoreBlogs = readMoreBlogs.map(blog => (
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
                    <button onClick={() => navigate(`/blog/${blogSlug(blog)}`)}>Read more <FontAwesomeIcon icon={faChevronRight} /></button>
                </div>
            </div>
        </div>
    ))

    return (
        <>
        <div className='ArticlePageContainer'>
            <PagesHeader />
            {displayedSelectedBlog}
        </div>
        <div className='ArticleText'>
            <div dangerouslySetInnerHTML={{ __html: selectedBlog.body }} />
            {service && <p className='ArticleServiceLink'>Want to talk this through with a therapist? Read about our <Link to={service.path}>{service.name}</Link>.</p>}
            {author && <p className='ArticleAuthorNote'>Written by <Link to={`/therapists/${therapistSlug(author)}`}>{author.name}</Link>, {String(author.position || 'therapist').trim()} at The Sonder Hood in New Cairo.</p>}
        </div>
        <div className='ReadMoreContainer'>
            <div className='ReadMoreTitle'>
                <h1>READ <span>MORE</span></h1>
            </div>
            <div className='TopicContainer'>
                {displayedReadMoreBlogs}
            </div>
        </div>
        </>
    )
}
