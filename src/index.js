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

//@ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
Promise.race([contentReady, timeout]).then(() => root.render(
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

