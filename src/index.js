import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './app/store';
import { fetchTherapists } from './app/therapists/therapistsSlice';
import { fetchServices } from './app/services/servicesSlice';
import { fetchBlogs } from './app/blogs/blogsSlice';
import { fetchTestimonials } from './app/testimonials/testimonialsSlice';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { startAnalytics } from './analytics';

if (process.env.NODE_ENV === 'production') disableReactDevTools()

startAnalytics()

// Load the site content (/content.json) before the first render, so a page goes
// straight from its prerendered HTML to the finished app instead of flashing a
// "Loading…" screen. If the file is slow, render anyway after two seconds.
const contentReady = Promise.all([fetchTherapists, fetchServices, fetchBlogs, fetchTestimonials].map(load => store.dispatch(load())))
const timeout = new Promise(resolve => setTimeout(resolve, 2000))

// The app also waits until the browser has recorded the prerendered page's largest
// paint, the speed measure Google uses. Replaced sooner, the browser forgets that
// paint and counts the app's first render instead, which on a slow phone comes
// seconds later. Browsers that do not report it wait at most 300 ms.
const paintRecorded = new Promise(resolve =>
{
	setTimeout(resolve, 300)
	try
	{
		new PerformanceObserver((list, observer) =>
		{
			observer.disconnect()
			resolve()
		}).observe({ type: 'largest-contentful-paint', buffered: true })
	}
	catch
	{
		resolve()
	}
})

// The prerendered home page's phone menu button jumps to the plain menu further down
// (#menu). That menu goes when the app takes over, so a visitor who tapped it is taken
// back to the top, next to the app's own menu button.
function leavePrerenderedMenu()
{
	if (window.location.hash !== '#menu') return
	window.history.replaceState(null, '', window.location.pathname + window.location.search)
	window.scrollTo(0, 0)
}

//@ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
Promise.race([Promise.all([contentReady, paintRecorded]), timeout]).then(leavePrerenderedMenu).then(() => root.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='/*' element={<App />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

