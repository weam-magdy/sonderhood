import React, { useEffect, useState } from 'react'
import { SITE } from '../../seo/meta.mjs'

// The latest posts from the practice's Instagram, three to a row at the end of the
// home page. /instagram.php copies them from a Behold feed to this site; while it
// has none (no feed yet, or Behold unreachable) the section stays hidden.
export default function InstagramFeed()
{
    const [posts, setPosts] = useState([])

    useEffect(() =>
    {
        let current = true
        fetch('/instagram.php', { headers: { Accept: 'application/json' } })
            .then(response => (response.ok ? response.json() : null))
            .then(data =>
            {
                if (current && data && Array.isArray(data.posts)) setPosts(data.posts.slice(0, 6))
            })
            .catch(() => {})
        return () =>
        {
            current = false
        }
    }, [])

    if (!posts.length) return null

    return (
        <section className='InstagramFeed' aria-labelledby='InstagramFeedTitle'>
            <h2 id='InstagramFeedTitle' className='InstagramFeedTitle'>Follow us on Instagram</h2>
            <a className='InstagramFeedHandle' href={SITE.socials.instagram} target='_blank' rel='noopener noreferrer'>@thesonderhood</a>
            <div className='InstagramFeedGrid'>
                {posts.map(post => (
                    <a key={post.id} className='InstagramFeedItem' href={post.link} target='_blank' rel='noopener noreferrer' aria-label={`Open on Instagram: ${post.alt}`}>
                        <img src={post.image} alt={post.alt} loading='lazy' decoding='async' />
                        {post.video && <span className='InstagramFeedVideo' aria-hidden='true'>▶</span>}
                    </a>
                ))}
            </div>
        </section>
    )
}
