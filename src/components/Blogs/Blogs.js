import React from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import blogmain from '../../imgs/blogmain.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectedBlogs } from '../../app/blogs/blogsSlice'

export default function Blogs()
{
    const blogs = useSelector(selectedBlogs)

    const navigate = useNavigate()

    const restofBlogs = blogs.slice(1)
    const firstBlog = blogs.slice(0, 1)

    const displayedBlogs = restofBlogs.map(blog => 
        (
            <div className='TopicMain'> 
                <div className='TopicMainImage'>
                    <img src={blog.image} alt='mid' />
                </div>
                <div className='TopicMainInfo'>
                    <div className='TopicMainInfoService'>
                        <div className='TopicMainInfoServiceName'>
                            Therapy Topic
                        </div>
                        <div className='TopicMainInfoServiceTime'>
                            5 min read
                        </div>
                    </div>
                    <div className='TopicMainInfoTitle'>
                        {blog.title}
                    </div>
                    <div className='TopicMainInfoDesc'>
                        {blog.description}
                    </div>
                    <div className='TopicMainInfoButton'>
                        <button onClick={() => navigate(`/ArticlePage/${blog.title.split(" ").join("")}`)}>Read more <FontAwesomeIcon style={{width: '7%'}} icon={faChevronRight} /></button>
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
                    <div className='AboutPageOurStoryTitle'>
                        OUR BLOG
                    </div>
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
                        <img src={firstBlog[0].image} alt='mid' />
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
                        <div className='BlogsMainInfoTitle'>
                            {firstBlog[0].title}
                        </div>
                        <div className='BlogsMainInfoDesc'>
                            {firstBlog[0].description}
                        </div>
                        <div className='BlogsMainInfoButton'>
                            <button>READ MORE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='TopicContainer'>
            {displayedBlogs}
        </div>
        </>
    )
}