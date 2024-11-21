import React, { useState } from 'react';
import './Contact.css';
import Nav from '../Navbar/navbar';
import emailjs from 'emailjs-com';

function ContactUs() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        phone: '',
        description: '',
        reactBased: 'no',
        gameTitle: '',
        githubLink: '',
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? (checked ? 'yes' : 'no') : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                'service_id',  //ENTER SERVICE ID API KEY FROM EMAIL JS 
                'template_id',  //ENTER TEMPLATE ID API KEY FROM EMAIL JS
                e.target, 
                'user_id' //ENTER USER ID API KEY FROM EMAIL JS
            )
            .then(
                (result) => {
                    console.log('Message sent: ', result.text);
                    alert('Your message has been sent!');
                },
                (error) => {
                    console.log('Error sending message: ', error.text);
                    alert('An error occurred. Please try again later.');
                }
            );
    };

    return (
        <>
            {Nav()}
            <div className='container_contact'>
                <div className="contact-block">
                    <div className="contact-block__header">
                        <h1>Contact Us</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="email"
                                className="contact-group__input"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="contact-group__input"
                                placeholder="Your name"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="tel"
                                className="contact-group__input"
                                placeholder="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="contact-group__input"
                                placeholder="Game Title"
                                name="gameTitle"
                                value={formData.gameTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="url"
                                className="contact-group__input"
                                placeholder="GitHub Link"
                                name="githubLink"
                                value={formData.githubLink}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <textarea
                                className="contact-group__input"
                                rows="4"
                                placeholder="Game Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <div className="checkbox-group">
                            <span>Is it React based?</span>
                            <div>
                                <input
                                    id="react-yes"
                                    name="reactBased"
                                    type="checkbox"
                                    checked={formData.reactBased === 'yes'}
                                    onChange={handleChange}
                                />
                                <label htmlFor="react-yes"></label>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="button">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ContactUs;
